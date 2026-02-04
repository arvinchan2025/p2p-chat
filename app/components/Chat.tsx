'use client'

import {useRef, useState} from 'react'
import {Box, Button, Paper, Stack, TextField, Typography} from '@mui/material'

import {createSignaling} from '@/app/lib/signaling'
import {createPeer} from '@/app/lib/webrtc'

type ChatMessage = {
  from: 'me' | 'peer'
  text: string
}

const Chat = () =>  {
  const [room, setRoom] = useState('')
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const peerRef = useRef<ReturnType<typeof createPeer> | null>(null)

  // 1️⃣ 点击加入房间
  const joinRoom = () => {
    if (!room) return

    const ws = createSignaling()

    const peer = createPeer(
      ws,
      room,
      (msg) => {
        setMessages((prev) => [
          ...prev,
          { from: 'peer', text: msg }
        ])
      },
      () => {
        setConnected(true)
      }
    )

    peerRef.current = peer
  }

  // 2️⃣ 发送消息
  const sendMessage = () => {
    if (!peerRef.current?.isConnected()) return
    if (!input.trim()) return

    peerRef.current.send(input)

    setMessages((prev) => [
      ...prev,
      { from: 'me', text: input }
    ])
    setInput('')
  }

  return (
    <Stack spacing={2} maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h5" align="center">
        P2P Chat
      </Typography>

      {/* 房间输入 */}
      {!connected && (
        <Stack direction="row" spacing={1}>
          <TextField
            label="Room Key"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={joinRoom}
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
        {connected ? 'Connected' : 'Waiting for peer...'}
      </Typography>

      {/* 聊天窗口 */}
      <Paper
        variant="outlined"
        sx={{
          height: 300,
          overflowY: 'auto',
          p: 1
        }}
      >
        <Stack spacing={1}>
          {messages.map((m, i) => (
            <Box
              key={i}
              sx={{
                alignSelf:
                  m.from === 'me' ? 'flex-end' : 'flex-start',
                bgcolor:
                  m.from === 'me'
                    ? 'primary.main'
                    : 'grey.300',
                color:
                  m.from === 'me'
                    ? 'white'
                    : 'black',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                maxWidth: '80%'
              }}
            >
              {m.text}
            </Box>
          ))}
        </Stack>
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
    </Stack>
  )
}
export default Chat