import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Se corrigió la ruta de importación

/**
 * @description Maneja las peticiones POST para registrar un nuevo pedido.
 * Llama al procedimiento almacenado 'registrar_pedido' que calcula el total.
 * @param {Request} request La petición HTTP entrante.
 * @returns {Response} Una respuesta JSON de éxito o error.
 */
export async function POST(request) {
  try {
    const { producto, cantidad } = await request.json();

    // Validar que los datos no sean nulos o indefinidos
    if (!producto || !cantidad) {
      return NextResponse.json(
        { message: 'Error: Faltan datos del pedido (nombre del producto o cantidad).' },
        { status: 400 }
      );
    }
    
    // Llama al procedimiento almacenado 'registrar_pedido' con tipos de datos explícitos
    await pool.query('CALL registrar_pedido($1::varchar, $2::int)', [producto, cantidad]);

    return NextResponse.json({ message: 'Pedido registrado con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar pedido:', error);
    return NextResponse.json(
      { message: `Error interno del servidor al registrar pedido: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id_orders } = await request.json();

    // Validar que se reciba el ID del pedido
    if (!id_orders) {
      return NextResponse.json(
        { message: 'Error: Se requiere el ID del pedido para eliminarlo.' },
        { status: 400 }
      );
    }

    // Llama al procedimiento almacenado 'eliminar_pedido_proc'
    await pool.query('CALL eliminar_pedido_proc($1)', [id_orders]);

    return NextResponse.json({ message: 'Pedido eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    return NextResponse.json(
      { message: `Error interno del servidor al eliminar pedido: ${error.message}` },
      { status: 500 }
    );
  }
}