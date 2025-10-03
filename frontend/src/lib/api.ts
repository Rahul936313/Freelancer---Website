export const API_BASE = import.meta.env.VITE_API_URL || "/api";

type RequestOpts = {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
};

async function request<T>(path: string, { method = "GET", body, headers = {} }: RequestOpts = {}) {
  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as unknown as T);
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: "GET" }),
  post: <T = any>(path: string, body?: any) => request<T>(path, { method: "POST", body }),
  put: <T = any>(path: string, body?: any) => request<T>(path, { method: "PUT", body }),
  del: <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
};