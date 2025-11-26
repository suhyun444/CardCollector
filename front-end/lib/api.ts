const API_BASE_URL = 'https://fantastic-space-spoon-g67gp4p99p4c9pr9-8080.app.github.dev';

const request = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('accessToken');
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(API_BASE_URL + url, {
    ...options,
    headers,
  });

  console.log(response);
  if (!response.ok) {
    console.log(response);
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login/google'; 
      throw new Error('UnAuthorized');
    }
    throw new Error('API request failed');
  }

  return response.json();
};

export const api = {
  get: (url: string) => request(url),
  
  post: (url: string, body: any) => {
    const isFormData = body instanceof FormData;
    
    return request(url, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  }
}