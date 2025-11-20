const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5025'

export const api = async (path, { method = 'GET', body, token, headers = {} } = {}) => {
  let url = `${BASE}${path}`
  if (method === 'GET') {
    const sep = url.includes('?') ? '&' : '?'
    url = `${url}${sep}_ts=${Date.now()}`
  }
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined
  })
  if (res.status === 304) {
    return undefined
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}
