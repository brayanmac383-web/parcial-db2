// src/app/(dashboard)/productos/page.jsx

import Card from "@/components/ui/Card";

// Más adelante, estos datos vendrán de tu base de datos PostgreSQL
const mockProductos = [
  { id: 1, nombre: "Laptop Pro", stock: 15, precio: 1500 },
  { id: 2, nombre: "Mouse Gamer", stock: 50, precio: 75 },
  { id: 3, nombre: "Teclado Mecánico", stock: 30, precio: 120 },
  { id: 4, nombre: "Monitor 4K", stock: 10, precio: 450 },
];

export default function ProductosPage() {
  return (
    <div>
      <h2>Inventario de Productos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {mockProductos.map((producto) => (
          <Card key={producto.id} title={producto.nombre}>
            <p><strong>Precio:</strong> ${producto.precio}</p>
            <p><strong>Stock:</strong> {producto.stock} unidades</p>
          </Card>
        ))}
      </div>
    </div>
  );
}