// src/lib/session.js

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// Opciones para la sesión
export const sessionOptions = {
  // ¡MUY IMPORTANTE! Asegúrate de tener esta variable en tu archivo .env.local
  password: process.env.SECRET_COOKIE_PASSWORD, 
  cookieName: 'parcialdb-session',
  cookieOptions: {
    // La cookie solo funciona en HTTPS en producción
    secure: process.env.NODE_ENV === 'production', 
  },
};

// Función para obtener los datos de la sesión actual que usan tus otras páginas
export async function getSession() {
  const session = await getIronSession(cookies(), sessionOptions);
  return session;
}