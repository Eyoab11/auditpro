// Frontend API helper used by the Next.js app
// Uses NEXT_PUBLIC_API_BASE_URL when set, otherwise falls back to same-origin requests.

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    credentials: opts.credentials ?? 'include',
    ...opts,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`apiFetch ${res.status} ${res.statusText} - ${text}`);
  }

  // Try to parse JSON, but return raw text if JSON fails
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export default apiFetch;
