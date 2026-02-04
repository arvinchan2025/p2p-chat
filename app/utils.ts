export function getUserId(): string {
  const KEY = 'p2p_chat_user_id'

  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}