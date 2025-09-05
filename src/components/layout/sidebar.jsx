// src/components/layout/sidebar.jsx
import Link from 'next/link';

export default function Sidebar() {
  const linkStyle = {
    display: 'block',
    color: 'white',
    padding: '10px 15px',
    textDecoration: 'none'
  };

  return (
    <aside style={{ 
      backgroundColor: '#4a4a4a', 
      width: '200px', 
      height: '100vh', 
      paddingTop: '20px'
    }}>
      <Link href="/productos" style={linkStyle}>Productos</Link>
      <Link href="/pedidos" style={linkStyle}>Pedidos</Link>
      <Link href="/clientes" style={linkStyle}>Clientes</Link>
    </aside>
  );
}