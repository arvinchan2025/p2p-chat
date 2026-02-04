// signal.ts
export type SignalMessage =
  | { type: 'join'; room: string; sender: string }
  | { type: 'offer'; room: string; sender: string; offer: RTCSessionDescriptionInit }
  | { type: 'answer'; room: string; sender: string; answer: RTCSessionDescriptionInit }
  | { type: 'ice'; room: string; sender: string; candidate: RTCIceCandidateInit }
