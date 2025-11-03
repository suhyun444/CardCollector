const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = { /* ... */ };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch("https://fantastic-space-spoon-g67gp4p99p4c9pr9-8080.app.github.dev"+url, {
    options,
    headers,
  });
};

export const api = {
  get: (url: string) => request(url),
  post: (url: string, body: any) => request(url, { method: 'POST', body: JSON.stringify(body) }),
};