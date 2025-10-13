export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getToken = (): string | null => {
	try {
		return localStorage.getItem('token');
	} catch {
		return null;
	}
};

export const setToken = (token: string) => {
	try {
		localStorage.setItem('token', token);
	} catch {}
};

export const clearToken = () => {
	try {
		localStorage.removeItem('token');
	} catch {}
};

export async function apiFetch<T = any>(
    path: string,
    options: RequestInit & { auth?: boolean } = {}
  ) {
    const url = `${API_BASE_URL}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
  
    if (options.auth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  }