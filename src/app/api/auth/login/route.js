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

export async function GET() {
  try {
    // Consulta para obtener todos los productos
    const productosResult = await pool.query('SELECT * FROM productos ORDER BY id_product');
    const productos = productosResult.rows;

    // Consulta para obtener todos los pedidos
    const pedidosResult = await pool.query('SELECT * FROM pedidos ORDER BY id_orders DESC');
    const pedidos = pedidosResult.rows;

    // Consulta para obtener todos los usuarios
    const usuariosResult = await pool.query('SELECT * FROM usuarios ORDER BY id_user');
    const usuarios = usuariosResult.rows;

    // Consulta para obtener todos los clientes
    const clientesResult = await pool.query('SELECT * FROM clientes ORDER BY id_client');
    const clientes = clientesResult.rows;
    
    // Consulta para calcular las ventas totales (asumiendo que hay una columna 'total' en la tabla 'pedidos')
    const ventasResult = await pool.query('SELECT SUM(total) as total_ventas FROM pedidos');
    const ventasTotales = ventasResult.rows[0].total_ventas || 0;

    const data = {
      usuarios,
      clientes,
      productos,
      pedidos,
      ventasTotales: parseFloat(ventasTotales)
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json({ message: 'Error interno del servidor al obtener datos' }, { status: 500 });
  }
}
