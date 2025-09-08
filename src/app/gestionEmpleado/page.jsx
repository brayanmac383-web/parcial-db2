"use client";
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    usuarios: [],
    clientes: [],
    productos: [],
    pedidos: [],
    ventasTotales: 0,
  });
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });

  const [newClient, setNewClient] = useState({ nombre: '', cc: '', telefono: '' });
  const [newOrder, setNewOrder] = useState({ cliente: '', producto: '', cantidad: '' });

  // Función para mostrar un mensaje y ocultarlo después de 3 segundos
  const showStatusMessage = (message, type) => {
    setStatusMessage({ message, type });
    setTimeout(() => {
      setStatusMessage({ message: '', type: '' });
    }, 3000);
  };

  // Función para obtener todos los datos del dashboard desde la API
  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard-data');
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la API.');
      }
      const data = await response.json();
      setDashboardData({
        usuarios: data.usuarios || [],
        clientes: data.clientes || [],
        productos: data.productos || [],
        pedidos: data.pedidos || [],
        ventasTotales: parseFloat(data.ventasTotales) || 0
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      showStatusMessage(`Error al cargar datos: ${error.message}`, 'error');
    }
  };

  // Se obtienen los datos al cargar el componente
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    showStatusMessage('Registrando cliente...', 'info');
    try {
      if (!newClient.nombre.trim() || !newClient.cc.trim() || !newClient.telefono.trim()) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el cliente.');
      }

      showStatusMessage('Cliente registrado exitosamente', 'success');
      setNewClient({ nombre: '', cc: '', telefono: '' });
      fetchData(); // Vuelve a cargar los datos para actualizar la UI
    } catch (error) {
      console.error('Error al registrar cliente:', error);
      showStatusMessage(`Error: ${error.message}`, 'error');
    }
  };


  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    showStatusMessage('Registrando pedido...', 'info');
  
    try {
      const productInfo = dashboardData.productos.find(p => p.nombre === newOrder.producto);
      const clientInfo = dashboardData.clientes.find(c => c.nombre === newOrder.cliente);
  
      if (!productInfo) {
        showStatusMessage('El producto seleccionado no es válido.', 'error');
        return;
      }
      if (!clientInfo) {
        showStatusMessage('El cliente seleccionado no es válido.', 'error');
        return;
      }
  
      const cantidadNumerica = parseInt(newOrder.cantidad);
      if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
        throw new Error('La cantidad debe ser un número válido mayor que cero.');
      }
  
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente: newOrder.cliente,
          producto: newOrder.producto, 
          cantidad: cantidadNumerica,
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el pedido.');
      }
    
      showStatusMessage('Pedido registrado exitosamente', 'success');
      setNewOrder({ cliente: '', producto: '', cantidad: '' });
      fetchData(); // Vuelve a cargar los datos para actualizar la UI
    } catch (error) {
      console.error('Error al registrar pedido:', error);
      showStatusMessage(`Error al registrar pedido: ${error.message}`, 'error');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Resumen General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">${dashboardData.ventasTotales.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.usuarios.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Total Productos</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.productos.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Pedidos Recientes</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.pedidos.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Pedidos</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.pedidos.slice(0, 5).map((pedido, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.producto}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.cantidad}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(pedido.total).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Productos con Bajo Stock</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.productos.filter(p => p.stock < 10).map((producto, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-semibold">{producto.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Gestión de Productos</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Productos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.productos.map((producto) => (
                      <tr key={producto.id_product} className="hover:bg-gray-100 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.id_product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(producto.valor).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Gestión de Pedidos</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Registrar Nuevo Pedido</h3>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label htmlFor="orderClient" className="block text-sm font-medium text-gray-700">Cliente</label>
                  <select
                    id="orderClient"
                    value={newOrder.cliente}
                    onChange={(e) => setNewOrder({ ...newOrder, cliente: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="" disabled>Selecciona un cliente</option>
                    {dashboardData.clientes.map(c => (
                      <option key={c.id_client} value={c.nombre}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="orderProduct" className="block text-sm font-medium text-gray-700">Producto</label>
                  <select
                    id="orderProduct"
                    value={newOrder.producto}
                    onChange={(e) => setNewOrder({ ...newOrder, producto: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="" disabled>Selecciona un producto</option>
                    {dashboardData.productos.map(p => (
                      <option key={p.id_product} value={p.nombre}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="orderQuantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
                  <input
                    type="number"
                    id="orderQuantity"
                    value={newOrder.cantidad}
                    onChange={(e) => setNewOrder({ ...newOrder, cantidad: e.target.value })}
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Registrar Pedido
                </button>
              </form>
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Gestión de Clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Registrar Nuevo Cliente</h3>
                  <form onSubmit={handleClientSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                      <input
                        type="text"
                        id="clientName"
                        value={newClient.nombre}
                        onChange={(e) => setNewClient({ ...newClient, nombre: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="clientCC" className="block text-sm font-medium text-gray-700">Cédula</label>
                      <input
                        type="text"
                        id="clientCC"
                        value={newClient.cc}
                        onChange={(e) => setNewClient({ ...newClient, cc: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                      <input
                        type="text"
                        id="clientPhone"
                        value={newClient.telefono}
                        onChange={(e) => setNewClient({ ...newClient, telefono: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Registrar Cliente
                    </button>
                  </form>
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Clientes</h3>
                  <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CC</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.clientes.map((client) => (
                          <tr key={client.id_client} className="hover:bg-gray-100 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.id_client}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.nombre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.cc}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.telefono}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center font-sans">
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl border-t-8 border-blue-500">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://placehold.co/40x40/4F46E5/FFFFFF?text=DB"
              alt="Logo"
              className="rounded-full w-10 h-10"
            />
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Gestión de Base de Datos
            </h1>
          </div>
        </header>

        <nav className="mb-8">
          <ul className="flex flex-wrap md:flex-nowrap justify-center md:justify-start -mb-px text-sm font-medium text-center space-x-2 md:space-x-4">
            <li className="mr-2">
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${activeTab === 'dashboard' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${activeTab === 'products' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('products')}
              >
                Productos
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${activeTab === 'orders' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('orders')}
              >
                Pedidos
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${activeTab === 'clients' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('clients')}
              >
                Clientes
              </a>
            </li>
          </ul>
        </nav>

        {statusMessage.message && (
          <div className={`p-4 mb-4 rounded-lg text-white font-bold text-center transition-opacity duration-500 ${statusMessage.type === 'success' ? 'bg-green-500' : statusMessage.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
            {statusMessage.message}
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default HomePage;