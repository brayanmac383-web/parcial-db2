// src/lib/auth.js
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose'; // Usaremos 'jose', una librería moderna y universal para JWT

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

// --- Función para encriptar ---
async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Sesión expira en 2 horas
    .sign(key);
}

// --- Función para desencriptar ---
async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    return null;
  }
}

// --- Lógica de la Sesión ---
export async function createSession(user) {
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas a partir de ahora
  const sessionData = {
    userId: user.id,
    nombre: user.nombre,
    rol: user.puesto.toLowerCase(),
    expires,
  };

  const session = await encrypt(sessionData);

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    path: '/',
  });
}

export async function getSession() {
  const cookie = cookies().get('session')?.value;
  if (!cookie) return null;
  return await decrypt(cookie);
}

export async function deleteSession() {
  cookies().delete('session');
}