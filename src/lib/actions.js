// src/lib/actions.js
"use server";

import { redirect } from 'next/navigation';
import { getSession } from './session'; // Asegúrate que session.js exista en /lib
import pool from '@/lib/db'; // IMPORTANTE: Usa la conexión local
import { revalidatePath } from 'next/cache';

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const result = await pool.query('SELECT id, nombre, email, puesto, password FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return { message: 'El correo electrónico no está registrado.' };
    }
    const passwordsMatch = (password === user.password);
    if (!passwordsMatch) {
      return { message: 'Contraseña incorrecta.' };
    }

    const session = await getSession();
    session.isLoggedIn = true;
    session.userId = user.id;
    session.nombre = user.nombre;
    session.rol = user.puesto.toLowerCase();
    await session.save();

    if (session.rol === 'gerente') {
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
    const session = await getSession();
    session.destroy();
    redirect('/login');
}

export async function getProducts() {
  try {
    const result = await pool.query('SELECT id, nombre, valor, stock FROM productos ORDER BY id DESC');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

export async function deleteProduct(productId) {
  const session = await getSession();
  if (!session.isLoggedIn || session.rol !== 'gerente') {
    throw new Error('No autorizado para realizar esta acción.');
  }
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [productId]);
    revalidatePath('/gestionAdmin');
  } catch (error) {
    console.error(error);
  }
}