// lib/api-server.js
import { cookies } from "next/headers";

// Função genérica para requisições no lado do servidor
async function apiFetchServer(path, options = {}) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;


  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/${path}`, {
    ...options,
    headers,
    cache: "no-store", // ou force-cache se quiser cachear
  });
  
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro na requisição do servidor.");
  }

  return res.json();
}

// Atalhos para métodos comuns
export const apiServer = {
  get: (path) => apiFetchServer(path),
  post: (path, body) =>
    apiFetchServer(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    apiFetchServer(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: (path) =>
    apiFetchServer(path, {
      method: "DELETE",
    }),
};
