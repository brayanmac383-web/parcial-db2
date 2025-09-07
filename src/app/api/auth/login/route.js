import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';


export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Buscar el usuario por su correo electrónico
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    // Si el usuario no existe, devolvemos un error
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // ADVERTENCIA: Esta comparación es muy insegura.
    // Compara la contraseña en texto plano del formulario con la de la base de datos.
    if (password !== user.password) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // Si todo es correcto, devolvemos una respuesta de éxito
    return NextResponse.json({ message: 'Inicio de sesión exitoso', user }, { status: 200 });

  } catch (error) {
    console.error('Error en la autenticación:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

