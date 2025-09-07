// src/lib/actions.js
"use server";

import { redirect } from 'next/navigation';
// CAMBIO: Importamos desde nuestro nuevo archivo 'auth.js'
import { getSession, createSession, deleteSession } from './auth';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const result = await pool.query('SELECT id, nombre, email, puesto, password FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return { message: 'El correo electrónico no está registrado.' };
    if (password !== user.password) return { message: 'Contraseña incorrecta.' };
    
    // Inicia la sesión con nuestro nuevo sistema
    await createSession(user);

    // La redirección sigue igual
    if (user.puesto.toLowerCase() === 'gerente') {
      redirect('/gestionAdmin');
    } else {
      redirect('/gestionEmpleado');
    }

  } catch (error) {
    console.error(error);
    return { message: 'Error en el servidor. Intente de nuevo.' };
  }
}

export async function logout() {
  // Cierra la sesión con nuestro nuevo sistema
  await deleteSession();
  redirect('/login');
}

export async function getProducts() {
  // ... esta función no cambia ...
  try {
    const result = await pool.query('SELECT id, nombre, valor, stock FROM productos ORDER BY id DESC');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

export async function deleteProduct(productId) {
  // ... esta función no cambia ...
  const session = await getSession();
  if (!session || session.rol !== 'gerente') {
    throw new Error('No autorizado para realizar esta acción.');
  }
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [productId]);
    revalidatePath('/gestionAdmin');
  } catch (error) {
    console.error(error);
  }
}