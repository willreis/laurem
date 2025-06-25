// lib/auth.js
import { api } from "./api";
import Cookies from "js-cookie";
import { jwtVerify, SignJWT } from 'jose';

export async function loginUser(email, password) {
  const payload = {
    email,
    senha: password,
  };
  const data = await api.post("auth/login", payload);


  // Salva token
  Cookies.set("token", data.token, { path: "/", sameSite: "Lax", secure: true });
  Cookies.set("perfil", data.usuario.perfil, { path: "/", sameSite: "Lax", secure: true });

  return data; // { token, user }
}

export function logoutUser() {
  document.cookie = "token=; Max-Age=0; path=/";
}

export async function sendPasswordResetEmail(payload){
  const data = await api.post("auth/reset-password", payload);
}


export async function registerUser(payload) {
  const data = await api.post("auth/register", payload);

  // Salva token
  document.cookie = `token=${data.token}; path=/`;

  return data; // { token, user }
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não está definido no ambiente');
  }
  return new TextEncoder().encode(secret);
};

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      getJwtSecretKey()
    );
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}