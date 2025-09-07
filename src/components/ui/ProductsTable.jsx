// src/components/ui/ProductsTable.jsx
"use client";
import { deleteProduct } from "@/lib/actions";

export default function ProductsTable({ products, userRole }) {
  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Nombre</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Valor</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Stock</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="p-4 text-sm text-gray-700">{product.id}</td>
              <td className="p-4 text-sm font-medium text-gray-900">{product.nombre}</td>
              <td className="p-4 text-sm text-gray-700">${product.valor}</td>
              <td className="p-4 text-sm text-gray-700">{product.stock}</td>
              <td className="p-4 text-sm">
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                    Editar
                  </button>
                  {userRole === 'gerente' && (
                    <form action={() => deleteProduct(product.id)}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}