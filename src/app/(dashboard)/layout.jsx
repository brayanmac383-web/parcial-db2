// src/app/(dashboard)/layout.jsx

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          {children} {/* Aquí se renderizará el contenido de cada página */}
        </main>
      </div>
    </div>
  );
}