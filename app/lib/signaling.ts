// signaling.ts
export function createSignaling(): WebSocket {
  return new WebSocket(
    'wss://free.blr2.piesocket.com/v3/1' +
      '?api_key=UJcNT9EnbiEyaVLLjqUUfWid8LZCZ5DkjePlIaEG' +
      '&notify_self=1'
  )
}
