// src/app/gestionEmpleado/page.jsx

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/actions";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/sidebar";
import ProductsTable from "@/components/ui/ProductsTable";

export default async function GestionEmpleadoPage() {
  // 1. Protege la ruta: verifica que el usuario haya iniciado sesión
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect('/login');
  }

  // 2. Obtiene los datos de los productos desde el servidor
  const products = await getProducts();

  return (
    // 3. Renderiza la estructura del dashboard con los componentes de layout
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar userName={session.nombre} />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar userRole={session.rol} />
        <main className="flex-grow p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Panel de Productos (Empleado)</h2>
          <p className="text-gray-600">Consulta y gestiona el inventario de productos.</p>
          
          {/* 4. Muestra la tabla de productos. 
            El componente 'ProductsTable' es inteligente y automáticamente
            ocultará el botón "Eliminar" porque el rol no es 'gerente'.
          */}
          <ProductsTable products={products} userRole={session.rol} />
        </main>
      </div>
    </div>
  );
}