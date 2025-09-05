// src/app/layout.js

import { Poppins } from 'next/font/google'; // Importamos la fuente
import './globals.css';

// Configuramos la fuente con los grosores que usaremos
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '700'] 
});

export const metadata = {
  title: 'Sistema de Gestión',
  description: 'Proyecto para el parcial de Bases de Datos',
};

export default function RootLayout({ children }) {
  return (
    // Aplicamos la fuente a toda la aplicación en la etiqueta <html>
    <html lang="es" className={poppins.className}> 
      <body>
        {children}
      </body>
    </html>
  );
}