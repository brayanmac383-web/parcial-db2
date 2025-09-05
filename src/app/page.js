// src/app/page.js
"use client"; // Necesario para usar hooks como useState para el hover

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  const styles = {
    mainContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#121212', // Un negro más suave y moderno
      color: '#ffffff',
    },
    title: {
      fontSize: '3.5rem', // Letra grande y llamativa
      fontWeight: '700',
      marginBottom: '1rem',
      textShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)', // Sombra para darle profundidad
    },
    subtitle: {
      fontSize: '1.25rem',
      fontWeight: '400',
      color: '#b3b3b3', // Un gris claro para el subtítulo
      maxWidth: '500px',
      marginBottom: '2.5rem',
    },
    loginButton: {
      padding: '15px 35px',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '50px', // Bordes completamente redondeados
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s ease', // Transición suave para todos los efectos
      boxShadow: isHovered ? '0px 5px 20px rgba(0, 123, 255, 0.4)' : '0px 2px 10px rgba(0, 0, 0, 0.3)',
      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
    }
  };

  return (
    <main style={styles.mainContainer}>
      <h1 style={styles.title}>Sistema de Gestión</h1>
      <p style={styles.subtitle}>
        La solución centralizada para administrar tus productos, pedidos y clientes.
      </p>
      
      <Link href="/login" passHref>
        <button
          style={styles.loginButton}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Iniciar Sesión
        </button>
      </Link>
    </main>
  );
}