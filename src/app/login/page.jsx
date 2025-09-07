// src/app/login/page.jsx
"use client";

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Inicio de sesión exitoso. ¡Bienvenido!');
        console.log('Usuario autenticado:', data.user);
        
        // --- Redirige al usuario basado en el puesto ---
        if (data.user.puesto === 'Gerente') {
          router.push('/gestionAdmin');
        } else if (data.user.puesto === 'Caja') {
          router.push('/gestionEmpleado');
        } else {
          router.push('/dashboard');
        }
      } else {
        setIsError(true);
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error de red o del cliente:', error);
      setIsError(true);
      setMessage('Error de conexión. Intenta de nuevo.');
    }
  };

  const styles = {
    mainContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
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
      gap: '16px',
    },
    input: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
      color: '#343a40',
    },
    button: {
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#007bff',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    messageContainer: {
      padding: '10px',
      marginBottom: '16px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724'
    }
  };

  return (
    <main style={styles.mainContainer}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        {message && (
          <div style={{ ...styles.messageContainer, ...(isError ? styles.errorMessage : styles.successMessage) }}>
            {message}
          </div>
        )}
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