// Frontend API helper used by the Next.js app
// Uses NEXT_PUBLIC_API_BASE_URL when set, otherwise falls back to same-origin requests.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const token = getToken();
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
    credentials: opts.credentials ?? 'include',
    ...opts,
  });

  if (!res.ok) {
  let errorPayload: any = undefined;
  try { errorPayload = await res.json(); } catch { /* ignore */ }
  const message = errorPayload?.error || errorPayload?.message || res.statusText;
  throw new Error(message);
  }

  // Try to parse JSON, but return raw text if JSON fails
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export default apiFetch;
