export const runtime = 'edge'

export async function GET(req: Request) {
  const { socket, response } =
    (globalThis as any).Deno.upgradeWebSocket(req)

  socket.onopen = () => {
    console.log('socket open')
  }

  socket.onmessage = (e: MessageEvent) => {
    socket.send(e.data)
  }

  return response
}
