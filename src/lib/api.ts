export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = (import.meta.env.VITE_API_BASE as string) || ''
  const url = base.endsWith('/') ? `${base.slice(0, -1)}${path.startsWith('/') ? path : `/${path}`}` : `${base}${path.startsWith('/') ? path : `/${path}`}`

  const defaultOpts: RequestInit = {
    credentials: 'include', // send cookies (HttpOnly) for auth
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  }

  const res = await fetch(url, defaultOpts)
  const contentType = res.headers.get('content-type') || ''
  let data: any = null
  if (contentType.includes('application/json')) {
    data = await res.json()
  } else {
    data = await res.text()
  }

  if (!res.ok) {
    const err = new Error(data?.detail || data || res.statusText)
    ;(err as any).status = res.status
    throw err
  }

  return data
}

export default apiFetch
