// src/components/layout/sidebar.jsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ userRole }) {
  const pathname = usePathname();
  const basePath = userRole === 'gerente' ? '/gestionAdmin' : '/gestionEmpleado';

  const links = [
    { href: basePath, label: 'Inicio' },
    { href: `${basePath}/productos`, label: 'Productos' },
    // Agrega más enlaces aquí en el futuro
  ];

  if (userRole === 'gerente') {
    links.push({ href: `${basePath}/reportes`, label: 'Reportes' });
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 h-full p-4">
      <nav className="flex flex-col gap-2">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}