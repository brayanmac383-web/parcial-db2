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
  // Corregido: Inicializar con valores numéricos para evitar el error NaN
  const [newProduct, setNewProduct] = useState({ nombre: '', stock: 0, valor: 0 });
  // Corregido: Añadido el campo 'cliente'
  const [newOrder, setNewOrder] = useState({ cliente: '', producto: '', cantidad: '' });

  // Función para obtener todos los datos del dashboard desde la API
  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard-data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Error al obtener los datos de la API.');
      }
      const data = await response.json();
      setDashboardData({
        usuarios: data.usuarios,
        clientes: data.clientes,
        productos: data.productos,
        pedidos: data.pedidos,
        ventasTotales: parseFloat(data.ventasTotales)
      });
      setStatusMessage({ message: 'Datos cargados exitosamente', type: 'success' });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setStatusMessage({ message: `Error al cargar datos: ${error.message}`, type: 'error' });
    }
  };

  // Se obtienen los datos al cargar el componente
  useEffect(() => {
    fetchData();
  }, []);

    const handleProductSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ message: 'Registrando producto...', type: 'info' });
    try {
      // Validar que el valor sea un número y el nombre no esté vacío
      if (isNaN(newProduct.valor) || newProduct.valor === null) {
        throw new Error('El valor del producto debe ser un número.');
      }
      if (!newProduct.nombre || newProduct.nombre.trim() === '') {
        throw new Error('El nombre del producto no puede estar vacío.');
      }
      
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: newProduct.nombre,
          stock: parseInt(newProduct.stock),
          valor: parseFloat(newProduct.valor)
        }),
      });
      if (!response.ok) {
        throw new Error('Error al registrar el producto.');
      }
      setStatusMessage({ message: 'Producto registrado exitosamente', type: 'success' });
      setNewProduct({ nombre: '', stock: 0, valor: 0 });
      fetchData(); // Vuelve a cargar los datos para actualizar la UI
    } catch (error) {
      console.error('Error al registrar producto:', error);
      setStatusMessage({ message: `Error al registrar producto: ${error.message}`, type: 'error' });
    }
  };
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ message: 'Registrando pedido...', type: 'info' });
  
    try {
      // Buscar la información del producto y cliente
      const productInfo = dashboardData.productos.find(p => p.nombre === newOrder.producto);
      const clientInfo = dashboardData.clientes.find(c => c.nombre === newOrder.cliente);
  
      if (!productInfo) {
        setStatusMessage({ message: 'El producto seleccionado no es válido.', type: 'error' });
        return;
      }
      if (!clientInfo) {
        setStatusMessage({ message: 'El cliente seleccionado no es válido.', type: 'error' });
        return;
      }
  
      const cantidadNumerica = parseInt(newOrder.cantidad);
      if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
        throw new Error('La cantidad debe ser un número válido mayor que cero.');
      }
  
      // const totalCalculado = cantidadNumerica * productInfo.valor; // El procedimiento almacenado calcula el total
  
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Ahora enviamos el nombre del producto, no el ID
          producto: productInfo.nombre, 
          cantidad: cantidadNumerica,
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el pedido.');
      }
    
      setStatusMessage({ message: 'Pedido registrado exitosamente', type: 'success' });
      setNewOrder({ cliente: '', producto: '', cantidad: '' });
      fetchData(); // Vuelve a cargar los datos para actualizar la UI
    } catch (error) {
      console.error('Error al registrar pedido:', error);
      setStatusMessage({ message: `Error al registrar pedido: ${error.message}`, type: 'error' });
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
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 text-blue-500 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l-.879-.879m3.326-1.571-1.332-.266A2.25 2.25 0 0110.25 18H18a2.25 2.25 0 012.25 2.25V21a.75.75 0 01-.75.75H4.5A.75.75 0 013.75 21v-1.5a2.25 2.25 0 012.25-2.25h1.5l1.332-.266z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">${dashboardData.ventasTotales.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 text-green-500 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.5a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.633z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.usuarios.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 text-purple-500 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75a.75.75 0 00-.75-.75H5.25a.75.75 0 00-.75.75V20.25h13.5V18.75zM12 11.25a.75.75 0 01-.75-.75V3.75a.75.75 0 011.5 0v6.75a.75.75 0 01-.75.75zM15 6.75a.75.75 0 01-.75-.75V3.75a.75.75 0 011.5 0v2.25a.75.75 0 01-.75.75z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Productos</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.productos.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 text-yellow-500 rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.532 0 2.847-.967 3.29-2.324l.558-1.776a2.25 2.25 0 00-1.12-2.982l-.63-.315M13.5 16.5h-3v-3m.75-6.75h2.25" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pedidos Recientes</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboardData.pedidos.length}</p>
                  </div>
                </div>
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
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Registrar Nuevo Producto</h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                  <input
                    type="text"
                    id="productName"
                    value={newProduct.nombre}
                    onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    id="productStock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="productValue" className="block text-sm font-medium text-gray-700">Valor</label>
                  <input
                    type="number"
                    id="productValue"
                    step="0.01"
                    value={newProduct.valor}
                    onChange={(e) => setNewProduct({ ...newProduct, valor: parseFloat(e.target.value) })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Registrar Producto
                </button>
              </form>
            </div>
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
                {/* Nuevo campo de selección de cliente */}
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
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Pedidos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor U.</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.pedidos.map((pedido) => (
                      <tr key={pedido.id_orders} className="hover:bg-gray-100 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.id_orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.producto}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.cantidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(pedido.valor_u).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(pedido.total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Gestión de Usuarios</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Usuarios</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puesto</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.usuarios.map((user) => (
                      <tr key={user.id_user} className="hover:bg-gray-100 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id_user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.puesto}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'clients':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Gestión de Clientes</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Clientes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
            <li className="mr-2">
              <a
                href="#"
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-all duration-300 ${activeTab === 'users' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('users')}
              >
                Usuarios
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