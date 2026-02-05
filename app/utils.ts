export function getUserId(): string {
  const KEY = 'p2p_chat_user_id'

  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

export function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString()
}