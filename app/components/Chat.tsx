'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {Avatar, Box, Button, Paper, Stack, TextField, Typography} from '@mui/material'

import {createSignaling} from '@/app/lib/signaling'
import {createPeer} from '@/app/lib/webrtc'
import {FlutterDash} from '@mui/icons-material'
import MeMessage from "@/app/components/MeMessage";
import PeerMessage from "@/app/components/PeerMessage";
import {formatDate, formatTime, getUserId} from "@/app/utils";

type ChatMessage = {
  id: string,
  from: string,
  room: string,
  text: string,
  ts: number
}

const Chat = () => {
  const [room, setRoom] = useState('')
  const [email, setEmail] = useState('')
  const [connected, setConnected] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const peerRef = useRef<ReturnType<typeof createPeer> | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const STORAGE_KEY = (roomId: string) => `chat_history_${roomId}`
  // 1️⃣ 点击加入房间
  const joinRoom = () => {
    if (!room) return
    if (!email) return
    setWaiting(true)
    const ws = createSignaling()

    const peer = createPeer(
      ws,
      room,
      (msg) => {
        const messageEvent = JSON.parse(msg)
        setMessages((prev) => {
          const newMessages = [
            ...prev,
            messageEvent
          ]
          localStorage.setItem(STORAGE_KEY(room), JSON.stringify(messages))
          return newMessages
        })
      },
      () => {
        setWaiting(false)
        setConnected(true)
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY(room)) || '[]')
        setMessages([...history])
      }
    )

    peerRef.current = peer
  }

  // 2️⃣ 发送消息
  const sendMessage = () => {
    if (!peerRef.current?.isConnected()) return
    if (!input.trim()) return
    const messageEvent = {
      id: crypto.randomUUID(),
      from: email,
      room,
      text: input.trim(),
      ts: Date.now(),
    }
    peerRef.current.send(JSON.stringify(messageEvent))
    setMessages((prev) => {
      const newMessages = [
        ...prev,
        messageEvent
      ]
      localStorage.setItem(STORAGE_KEY(room), JSON.stringify(messages))
      return newMessages
    })
    setInput('')
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  return (
    <Stack spacing={2} maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" align="center">
        AI 智能查询机器人
      </Typography>

      {/* 房间输入 */}
      {!connected && (
        <Stack direction="column" spacing={1}>
          <TextField
            required={true}
            label="Room Key"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth
          />
          <TextField
            required={true}
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={joinRoom}
            loading={waiting}
          >
            Join
          </Button>
        </Stack>
      )}

      {/* 状态 */}
      <Typography
        variant="body2"
        color={connected ? 'green' : 'text.secondary'}
      >
        {connected ? 'Connected' : 'Waiting for connecting...'}
      </Typography>

      {/* 聊天窗口 */}
      {connected &&
          <>
              <Paper
                  variant="outlined"
                  sx={{
                    height: 300,
                    overflowY: 'auto',
                    p: 1
                  }}
              >
                  <Stack spacing={1}>
                    {messages.map((m, i) => {
                      const prev = messages[i - 1]
                      const showTime =
                        !prev || m.ts - prev.ts > 5 * 60 * 1000
                      return (
                        <Box key={i}>
                          {showTime && (
                            <Box
                              sx={{
                                textAlign: 'center',
                                color: 'text.secondary',
                                fontSize: 12,
                                my: 1,
                              }}
                            >
                              {formatDate(m.ts)} {formatTime(m.ts)}
                            </Box>
                          )}
                          {
                            m.from === email
                              ? <MeMessage message={m}/>
                              : <PeerMessage message={m}/>
                          }
                        </Box>
                      )
                    })}
                  </Stack>
                  <div ref={bottomRef}/>
              </Paper>

            {/* 输入框 */}
              <Stack direction="row" spacing={1}>
                  <TextField
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage()
                        }
                      }}
                      fullWidth
                      placeholder={
                        connected ? 'Type message...' : 'Not connected'
                      }
                      disabled={!connected}
                  />
                  <Button
                      variant="contained"
                      onClick={sendMessage}
                      disabled={!connected}
                  >
                      Send
                  </Button>
              </Stack>
          </>}
    </Stack>
  )
}
export default Chat