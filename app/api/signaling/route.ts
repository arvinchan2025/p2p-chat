export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  // ✅ 必须有明确参数
  const room = searchParams.get('room')

  if (!room) {
    return new Response('room required', { status: 400 })
  }

  const { socket, response } =
    (globalThis as any).Deno.upgradeWebSocket(req)

  socket.onopen = () => {
    socket.send(`joined room: ${room}`)
  }

  socket.onmessage = (e: any) => {
    socket.send(`echo: ${e.data}`)
  }

  socket.onclose = () => {
    console.log('socket closed')
  }

  return response
}
