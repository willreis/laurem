// lib/api.js
import { toast } from "sonner";
// import { redirectToLogin } from "./redirect";

export function getTokenFromCookie(ctx) {
  if (ctx && ctx.req) {
    // Estamos no servidor (getServerSideProps)
    const cookie = ctx.req.headers.cookie || "";
    const match = cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : null;
  } else if (typeof window !== "undefined") {
    // Cliente
    const match = document.cookie.match(/(^|;)\s*token=([^;]*)/);
    return match ? match[2] : null;
  }
  return null;
}



// Função genérica
export async function apiFetch(path, options = {}) {
  const token = getTokenFromCookie();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/${path}`, {
      ...options,
      headers,
    });

    // Token expirado
    if (res.status === 403) {
      toast.error("Sessão expirada. Faça login novamente.");
      document.cookie = "token=; Max-Age=0; path=/";
      // setTimeout(() => redirectToLogin(), 2500);
      // throw new Error("Sessão expirada");u
    }
    

    if (res.status === 406) {
      return res.json();
    }

    if (!res.ok) {
      const errorData = await res.json();
      // toast.error(errorData.message || "Erro ao comunicar com o servidor.");
      console.log(errorData.message || "Erro de requisição");
    }

    return res.json();
  } catch (err) {
    // console.error("Erro no apiFetch:", err);
    if (!err.handled) {
      // toast.error("Erro inesperado");
    }
    // throw err;
  }
}

// Atalhos para métodos comuns
export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) =>
    apiFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    apiFetch(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  del: (path) =>
    apiFetch(path, {
      method: "DELETE",
    }),
};
