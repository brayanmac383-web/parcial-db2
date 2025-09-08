import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // RUTA CORREGIDA

/**
 * @description Maneja las peticiones POST para registrar un nuevo cliente.
 * @param {Request} request La petición HTTP entrante con los datos del cliente.
 * @returns {Response} Una respuesta JSON de éxito o un mensaje de error.
 */
export async function POST(request) {
  try {
    const { nombre, cc, telefono } = await request.json();

    // Validación de que los campos no estén vacíos
    if (!nombre || !cc || !telefono) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const query = 'INSERT INTO clientes (nombre, cc, telefono) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, cc, telefono];

    const result = await pool.query(query, values);

    const newClient = result.rows[0];
    return NextResponse.json({ message: 'Cliente registrado con éxito', cliente: newClient }, { status: 201 });

  } catch (error) {
    console.error('Error al registrar cliente:', error);
    // Manejo de error específico para cédula duplicada (código de error de PostgreSQL para unique_violation)
    if (error.code === '23505') {
        return NextResponse.json({ message: 'Error: La cédula ya se encuentra registrada.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Error interno del servidor al registrar el cliente.' }, { status: 500 });
  }
}