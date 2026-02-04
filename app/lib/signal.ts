// signal.ts
export type SignalMessage =
  | { type: 'join'; room: string; sender: string }
  | { type: 'offer'; room: string; sender: string; offer: RTCSessionDescriptionInit }
  | { type: 'answer'; room: string; sender: string; answer: RTCSessionDescriptionInit }
  | { type: 'ice'; room: string; sender: string; candidate: RTCIceCandidateInit }


export type P2PMessage =
  | {
      type: 'chat'
      id: string
      text: string
      ts: number
    }
  | {
      type: 'typing'
      typing: boolean
    }
  | {
      type: 'read'
      messageId: string
    }
  | {
      type: 'ping'
      ts: number
    }
  | {
      type: 'pong'
      ts: number
    }
