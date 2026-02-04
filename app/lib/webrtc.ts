// webrtc.ts
import { SignalMessage } from './signal'

export function createPeer(
  ws: WebSocket,
  room: string,
  onMessage: (msg: string) => void,
  onOpen: () => void
) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  })

  const sender = crypto.randomUUID()
  let channel: RTCDataChannel | null = null
  let isLeader = false
  const peers = new Set<string>()

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      ws.send(
        JSON.stringify({
          type: 'ice',
          room,
          sender,
          candidate: e.candidate
        })
      )
    }
  }

  pc.ondatachannel = (e) => {
    channel = e.channel
    channel.onmessage = (ev) => onMessage(ev.data)
    channel.onopen = onOpen
  }

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: 'join',
        room,
        sender
      })
    )
  }

  ws.onmessage = async (e) => {
    const msg: SignalMessage = JSON.parse(e.data)

    // 🔒 房间隔离
    if (msg.room !== room) return
    // 🔒 忽略自己
    if (msg.sender === sender) return

    if (msg.type === 'join') {
      peers.add(msg.sender)

      // 🧠 第一个看到对方的人当 leader
      if (!isLeader) {
        isLeader = true
        channel = pc.createDataChannel('chat')
        channel.onmessage = (ev) => onMessage(ev.data)
        channel.onopen = onOpen

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        ws.send(
          JSON.stringify({
            type: 'offer',
            room,
            sender,
            offer
          })
        )
      }
      return
    }

    if (msg.type === 'offer') {
      if (pc.signalingState !== 'stable') return

      await pc.setRemoteDescription(msg.offer)
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      ws.send(
        JSON.stringify({
          type: 'answer',
          room,
          sender,
          answer
        })
      )
    }

    if (
      msg.type === 'answer' &&
      pc.signalingState === 'have-local-offer'
    ) {
      await pc.setRemoteDescription(msg.answer)
    }

    if (msg.type === 'ice') {
      await pc.addIceCandidate(msg.candidate)
    }
  }

  return {
    send(text: string) {
      if (channel?.readyState === 'open') {
        channel.send(text)
      }
    },
    isConnected() {
      return channel?.readyState === 'open'
    }
  }
}
