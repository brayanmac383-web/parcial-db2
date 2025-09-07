// src/app/gestionAdmin/page.jsx
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/actions";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/sidebar";
import ProductsTable from "@/components/ui/ProductsTable";

export default async function GestionAdminPage() {
  const session = await getSession();
  if (!session.isLoggedIn || session.rol !== 'gerente') {
    redirect('/login');
  }
  const products = await getProducts();

  return (
    <div className="h-screen flex flex-col">
      <Navbar userName={session.nombre} />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar userRole={session.rol} />
        <main className="flex-grow p-8 overflow-y-auto bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Productos (Admin)</h2>
          <p className="text-gray-600">Aquí puedes ver y administrar el inventario de productos.</p>
          <ProductsTable products={products} userRole={session.rol} />
        </main>
      </div>
    </div>
  );
}