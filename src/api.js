async function request(method, url, body) {
  const res = await fetch('/api' + url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* khali jawab */ }
  if (!res.ok) {
    if (res.status === 401 && !url.startsWith('/auth/')) window.dispatchEvent(new Event('unauthorized'));
    const err = new Error((data && data.message) || 'Masla aa gaya, dobara koshish karein');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  get: (u) => request('GET', u),
  post: (u, b) => request('POST', u, b || {}),
  put: (u, b) => request('PUT', u, b),
  del: (u) => request('DELETE', u),
};
