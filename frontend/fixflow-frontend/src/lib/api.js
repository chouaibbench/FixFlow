const BASE_URL = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('fixflow_token');

const request = async (method, path, body = null) => {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data.message || 'Request failed' };
  return data;
};

export const api = {
  post: (path, body) => request('POST', path, body),
  get:  (path)       => request('GET',  path),
  put:  (path, body) => request('PUT',  path, body),
  delete: (path)     => request('DELETE', path),
};
