// src/components/layout/Navbar.jsx
"use client";
import { logout } from '@/lib/actions';

export default function Navbar({ userName }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between shadow-sm z-10">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Bienvenido, {userName}</span>
        <form action={logout}>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </nav>
  );
}