import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// El modelo de datos del dashboard.
// Asume que las tablas y columnas existen en la base de datos.
// Se recomienda usar Promise.all para ejecutar todas las consultas en paralelo.
// Esto mejora el rendimiento general de la aplicación.

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // 1. Buscar el usuario por su correo electrónico
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        // Si el usuario no existe, devolvemos un error.
        if (!user) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        // ADVERTENCIA DE SEGURIDAD: Esta comparación es extremadamente insegura.
        // No está hasheando la contraseña, lo que la hace vulnerable.
        // Se recomienda encarecidamente usar una librería como bcryptjs para hashear.
        if (password !== user.password) {
            return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
        }

        // Si todo es correcto, devolvemos una respuesta de éxito.
        // Considera no devolver toda la información del usuario por seguridad.
        return NextResponse.json({ message: 'Inicio de sesión exitoso', user }, { status: 200 });

    } catch (error) {
        console.error('Error en la autenticación:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Ejecuta todas las consultas a la base de datos de forma paralela.
        const [
            productosResult,
            pedidosResult,
            usuariosResult,
            clientesResult,
            ventasResult
        ] = await Promise.all([
            pool.query('SELECT * FROM productos ORDER BY id_product'),
            pool.query('SELECT * FROM pedidos ORDER BY id_orders DESC'),
            pool.query('SELECT * FROM usuarios ORDER BY id_user'),
            pool.query('SELECT * FROM clientes ORDER BY id_client'),
            pool.query('SELECT SUM(total) as total_ventas FROM pedidos')
        ]);

        const data = {
            usuarios: usuariosResult.rows,
            clientes: clientesResult.rows,
            productos: productosResult.rows,
            pedidos: pedidosResult.rows,
            ventasTotales: parseFloat(ventasResult.rows[0].total_ventas) || 0,
        };

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        return NextResponse.json({ message: 'Error interno del servidor al obtener datos' }, { status: 500 });
    }
}
