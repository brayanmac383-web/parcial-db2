// Esta ruta de API de Next.js gestiona la inserción de productos.
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request) {
    try {
        const { nombre, stock, valor } = await request.json();

        // Para invocar un procedimiento almacenado en PostgreSQL,
        // debes usar la palabra clave 'CALL' en lugar de 'SELECT'.
        await pool.query(
            'CALL insertar_producto_proc($1, $2, $3)',
            [nombre, stock, valor]
        );

        // Si el procedimiento se ejecuta correctamente, devolvemos una respuesta de éxito.
        // No es necesario verificar 'result.rows' ya que los procedimientos no devuelven datos.
        return NextResponse.json({ message: 'Producto insertado con éxito' }, { status: 201 });

    } catch (error) {
        console.error('Error al insertar producto:', error);
        return NextResponse.json({ message: 'Error interno del servidor al insertar producto' }, { status: 500 });
    }
}
