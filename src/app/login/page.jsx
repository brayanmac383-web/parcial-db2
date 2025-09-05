// src/app/login/page.jsx

// "use client" es necesario porque usaremos estado (useState) para manejar los inputs del formulario.
"use client";

import { useState } from 'react';

// ¡Importante! El nombre del componente empieza con mayúscula: LoginPage
export default function LoginPage() {
  // Estados para guardar el valor del email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene que la página se recargue al enviar el form
    // Aquí irá la lógica para conectar con tu base de datos y validar al usuario
    console.log('Iniciando sesión con:', { email, password });
  };

  // --- ESTILOS (CSS-in-JS) ---
  const styles = {
    mainContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5', // Un fondo gris claro
      fontFamily: 'sans-serif',
    },
    loginCard: {
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    title: {
      marginBottom: '24px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px', // Espacio entre los elementos del formulario
    },
    input: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #0f0f0fff',
      fontSize: '16px',
      color: '#343a40', // <-- AÑADE ESTA LÍNEA para oscurecer el texto
    },
    button: {
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#007bff', // Un azul moderno
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s', // Efecto suave al pasar el mouse
    }
    
  };

  return (
    <main style={styles.mainContainer}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}