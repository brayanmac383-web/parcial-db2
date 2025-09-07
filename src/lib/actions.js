// src/lib/actions.js
"use server";

import { redirect } from 'next/navigation';
import { getSession } from './session';
// import bcrypt from 'bcryptjs'; // <-- ELIMINADO: Ya no se necesita bcrypt
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// =============================================
// --- ACCIONES DE AUTENTICACIÓN Y SESIÓN ---
// =============================================

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    // 1. Buscar al usuario en la base de datos
    // Asegúrate de que tu columna se llame 'password'. Si la llamaste 'password_hash', cámbialo aquí.
    const result = await sql`SELECT id, nombre, email, puesto, password FROM usuarios WHERE email = ${email}`;
    const user = result.rows[0];

    if (!user) {
      return { message: 'El correo electrónico no está registrado.' };
    }

    // 2. Comparar la contraseña en texto plano (MÉTODO INSEGURO)
    // Se compara directamente el texto ingresado con el texto de la base de datos.
    const passwordsMatch = (password === user.password);

    if (!passwordsMatch) {
      return { message: 'Contraseña incorrecta.' };
    }

    // 3. Si todo es correcto, crear la sesión
    const session = await getSession();
    session.isLoggedIn = true;
    session.userId = user.id;
    session.nombre = user.nombre;
    session.rol = user.puesto.toLowerCase();
    await session.save();

    // 4. Redirigir según el rol
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


// =============================================
// --- ACCIONES PARA PRODUCTOS (CRUD) ---
// =============================================

// OBTENER TODOS LOS PRODUCTOS
export async function getProducts() {
  try {
    const result = await sql`SELECT id, nombre, valor, stock FROM productos ORDER BY id DESC`;
    return result.rows;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// ELIMINAR UN PRODUCTO (¡Solo para Admin!)
export async function deleteProduct(productId) {
  const session = await getSession();

  // Verificación de rol en el backend
  if (!session.isLoggedIn || session.rol !== 'gerente') {
    throw new Error('No autorizado para realizar esta acción.');
  }

  try {
    await sql`DELETE FROM productos WHERE id = ${productId}`;
    revalidatePath('/gestionAdmin');
  } catch (error) {
    console.error(error);
  }
}