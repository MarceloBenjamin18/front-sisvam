import React, { useState, useEffect } from "react";
import { 
  obtenerSucursales, obtenerSucursalPorId, 
  crearSucursal, editarSucursal, eliminarSucursal 
} from '../../services/sucursales';
import { 
  BadgePlus, X, AlertCircle, CheckCircle, Home,
  MapPin, Phone, Clock, Mail, Building,Power,
  Edit, Trash2, Search, Grid, LayoutList, 
  ChevronLeft, ChevronRight, CreditCard, User,Hash 
} from 'lucide-react';
import { List } from "lucide-react";
// ---------------------- COMPONENTES HIJO ----------------------

const SucursalCard = ({ sucursal, index, onEditClick, onDeleteClick }) => {
  const iconColors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600'
  ];
  const iconClass = iconColors[index % iconColors.length];

  const getTipoIcon = () => {
    switch(sucursal.tipo) {
      case 'CAJA_RECAUDADORA': return <CreditCard className="w-4 h-4" />;
      case 'DISTRITO': return <Home className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  return (
    <div className="group flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 h-full">
      {/* Header con icono y estado */}
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconClass} shadow-lg`}>
          {getTipoIcon({ className: "w-6 h-6 text-white" })}
        </div>
        
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-1">
            {sucursal.codigo}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${sucursal.estado === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 inline-block ${sucursal.estado === 1 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            {sucursal.estado === 1 ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">{sucursal.nombre}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
          {getTipoIcon()}
          <span>{sucursal.tipo.replace(/_/g, ' ')}</span>
          {sucursal.distrito && <span>• {sucursal.distrito}</span>}
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          {sucursal.direccion && (
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {sucursal.direccion}
            </p>
          )}
          
          {sucursal.telefono && (
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {sucursal.telefono}
            </p>
          )}
          
          {sucursal.responsable && (
            <p className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Responsable:</span> {sucursal.responsable}
            </p>
          )}
        </div>
      </div>

      {/* Sección de botones */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button 
          onClick={() => onEditClick(sucursal)}
          className="group/btn flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          Editar
        </button>
        <button 
          onClick={() => onDeleteClick(sucursal)}
          className="group/btn flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

const SucursalRow = ({ sucursal, onEditClick, onDeleteClick }) => {
  const getTipoIcon = () => {
    switch(sucursal.tipo) {
      case 'CAJA_RECAUDADORA': return <CreditCard className="w-4 h-4" />;
      case 'DISTRITO': return <Home className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 shadow-md">
            {getTipoIcon({ className: "h-5 w-5" })}
          </div>
          <div className="ml-4">
            <div className="text-lg font-semibold text-gray-900">{sucursal.nombre}</div>
            <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
              {getTipoIcon()}
              {sucursal.tipo.replace(/_/g, ' ')}
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full ml-2">
                {sucursal.codigo}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
        {sucursal.direccion && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {sucursal.direccion}
          </div>
        )}
      </td>
      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
        {sucursal.responsable && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {sucursal.responsable}
          </div>
        )}
      </td>
      <td className="px-6 py-5">
        <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full shadow-sm ${sucursal.estado === 1 ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'}`}>
          {sucursal.estado === 1 ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => onEditClick(sucursal)}
            className="group/btn flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Editar
          </button>
          <button 
            onClick={() => onDeleteClick(sucursal)}
            className="group/btn flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
};

// ---------------------- COMPONENTE PRINCIPAL ----------------------

export default function SucursalesPanel() {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Estados para los modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sucursalToDelete, setSucursalToDelete] = useState(null);
  
  // Estado para el formulario
  const [currentSucursal, setCurrentSucursal] = useState({
    nombre: "",
    tipo: "DISTRITO",
    codigo: "",
    direccion: "",
    distrito: "",
    responsable: "",
    telefono: "",
    estado: 1
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerSucursales();
        setSucursales(data);
      } catch (err) {
        console.error('Error fetching sucursales:', err);
        setError('Error al cargar las sucursales');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSucursal({
      ...currentSucursal,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    if (!currentSucursal.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!currentSucursal.tipo.trim()) errors.tipo = "El tipo es requerido";
    if (!currentSucursal.codigo.trim()) errors.codigo = "El código es requerido";
    return errors;
  };

  // Manejador para crear una nueva sucursal
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitStatus('loading');
      const result = await crearSucursal(currentSucursal);
      
      if (result.success) {
        setSubmitStatus('success');
        // Actualizar la lista de sucursales
        const data = await obtenerSucursales();
        setSucursales(data);
        
        setTimeout(() => {
          setShowCreateModal(false);
          setSubmitStatus(null);
          resetForm();
        }, 1500);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error creating sucursal:', error);
      setSubmitStatus('error');
    }
  };

  // Manejador para editar una sucursal
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitStatus('loading');
      const result = await editarSucursal(currentSucursal.id, currentSucursal);
      
      if (result.success) {
        setSubmitStatus('success');
        // Actualizar la lista de sucursales
        const data = await obtenerSucursales();
        setSucursales(data);
        
        setTimeout(() => {
          setShowEditModal(false);
          setSubmitStatus(null);
          resetForm();
        }, 1500);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error editing sucursal:', error);
      setSubmitStatus('error');
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setCurrentSucursal({
      nombre: "",
      tipo: "DISTRITO",
      codigo: "",
      direccion: "",
      distrito: "",
      responsable: "",
      telefono: "",
      estado: 1
    });
    setFormErrors({});
  };

  // Manejador para el clic en editar
  const handleEditClick = (sucursal) => {
    setCurrentSucursal({
      id: sucursal.id,
      nombre: sucursal.nombre || '',
      tipo: sucursal.tipo || 'DISTRITO',
      codigo: sucursal.codigo || '',
      direccion: sucursal.direccion || '',
      distrito: sucursal.distrito || '',
      responsable: sucursal.responsable || '',
      telefono: sucursal.telefono || '',
      estado: sucursal.estado ?? 1
    });
    setShowEditModal(true);
  };

  // Manejador para el clic en eliminar
  const handleDeleteClick = (sucursal) => {
    setSucursalToDelete(sucursal);
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      setDeleteStatus('loading');
      const result = await eliminarSucursal(sucursalToDelete.id);
      
      if (result.success) {
        setDeleteStatus('success');
        // Actualizar la lista de sucursales
        const data = await obtenerSucursales();
        setSucursales(data);
        
        setTimeout(() => {
          setShowDeleteModal(false);
          setDeleteStatus(null);
          setSucursalToDelete(null);
        }, 1500);
      } else {
        setDeleteStatus('error');
      }
    } catch (error) {
      console.error('Error deleting sucursal:', error);
      setDeleteStatus('error');
    }
  };

  // Filtrar y paginar sucursales
  const filteredSucursales = sucursales.filter(sucursal => {
    const matchesSearch = sucursal.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sucursal.direccion && sucursal.direccion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sucursal.telefono && sucursal.telefono.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sucursal.codigo && sucursal.codigo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sucursal.responsable && sucursal.responsable.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'active' && sucursal.estado === 1) ||
      (activeFilter === 'inactive' && sucursal.estado !== 1);

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSucursales.length / itemsPerPage);
  const paginatedSucursales = filteredSucursales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Renderizado condicional para estados de carga/error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando sucursales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Error al cargar los datos</h3>
          <p className="text-gray-600 mb-6">No se pudieron cargar las sucursales. Por favor intenta nuevamente.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Render principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Panel superior */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 h-52 w-full shadow-2xl relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Sucursales</h1>
              <p className="text-blue-100 text-lg font-medium">Sistema de gestión de sucursales</p>
            </div>
          </div>

          {/* Búsqueda mejorada */}
          <div className="mt-8 relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-12 py-4 border-0 rounded-2xl bg-white/95 backdrop-blur-sm focus:ring-4 focus:ring-white/30 focus:bg-white shadow-2xl text-lg placeholder-gray-500"
              placeholder="Buscar sucursales por nombre, dirección, teléfono o código..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-2xl transition-colors"
              >
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
          <div className="border-b border-gray-100 p-8 bg-gradient-to-r from-white to-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{filteredSucursales.length} sucursales encontradas</h2>
                <p className="text-gray-500">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredSucursales.length)} de {filteredSucursales.length}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                {/* Selector de cantidad mejorado */}
                <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-md border border-gray-200">
                  <label className="text-sm font-medium text-gray-600">Mostrar:</label>
                  <select
                    className="text-sm border-0 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white transition-colors font-medium"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setItemsPerPage(Number(e.target.value));
                    }}
                  >
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                  </select>
                </div>

                {/* Filtros mejorados */}
                <div className="flex gap-2">
                  {[
                    { label: "Todos", key: "all", gradient: "from-blue-500 to-blue-600", hoverGradient: "from-blue-600 to-blue-700" },
                    { label: "Activos", key: "active", gradient: "from-green-500 to-green-600", hoverGradient: "from-green-600 to-green-700" },
                    { label: "Inactivos", key: "inactive", gradient: "from-gray-500 to-gray-600", hoverGradient: "from-gray-600 to-gray-700" },
                  ].map(({ label, key, gradient, hoverGradient }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveFilter(key);
                        setCurrentPage(1);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
                        activeFilter === key
                          ? `bg-gradient-to-r ${gradient} hover:${hoverGradient} text-white shadow-xl`
                          : `bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:shadow-xl`
                      }`}
                    >
                      {activeFilter === key && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>

                {/* Botón Nueva Sucursal mejorado */}
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <BadgePlus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  Nueva Sucursal
                </button>

                {/* Vista mejorada */}
                <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista o grid */}
          <div className="p-8">
            {filteredSucursales.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-300 text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No se encontraron resultados</h3>
                <p className="text-gray-500 text-lg">
                  {searchQuery ? `No hay sucursales que coincidan con "${searchQuery}"` : "No hay sucursales disponibles"}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {paginatedSucursales.map((sucursal, index) => (
                  <SucursalCard 
                    key={sucursal.id} 
                    sucursal={sucursal} 
                    index={index} 
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Sucursal</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Dirección</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Responsable</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedSucursales.map((sucursal) => (
                      <SucursalRow 
                        key={sucursal.id} 
                        sucursal={sucursal} 
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación mejorada */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                      : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg">
                    {currentPage}
                  </span>
                  <span className="text-gray-500 font-medium">de {totalPages}</span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                      : 'bg-white text-blue-600 hover:bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <BadgePlus className="text-white w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white">Crear Nueva Sucursal</h2>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormErrors({});
                  setSubmitStatus(null);
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-8 space-y-8 bg-white rounded-b-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nombre */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-purple-100 rounded-lg">
                      <Building className="w-4 h-4 text-purple-600" />
                    </div>
                    Nombre de la Sucursal*
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={currentSucursal.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.nombre 
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Ej: Sucursal Central"
                  />
                  {formErrors.nombre && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.nombre}
                    </p>
                  )}
                </div>

                {/* Código */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Hash className="w-4 h-4 text-blue-600" />
                    </div>
                    Código *
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={currentSucursal.codigo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.codigo 
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Ej: SUC001"
                  />
                  {formErrors.codigo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.codigo}
                    </p>
                  )}
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-orange-100 rounded-lg">
                      <List className="w-4 h-4 text-orange-600" />
                    </div>
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    value={currentSucursal.tipo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.tipo 
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                  >
                    <option value="DISTRITO">Distrito</option>
                    <option value="CAJA_RECAUDADORA">Caja Recaudadora</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  {formErrors.tipo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.tipo}
                    </p>
                  )}
                </div>

                {/* Distrito */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-lg">
                      <Home className="w-4 h-4 text-green-600" />
                    </div>
                    Distrito
                  </label>
                  <input
                    type="text"
                    name="distrito"
                    value={currentSucursal.distrito}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Centro"
                  />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-yellow-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                    </div>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={currentSucursal.direccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Av. Principal #123"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-red-100 rounded-lg">
                      <Phone className="w-4 h-4 text-red-600" />
                    </div>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={currentSucursal.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 71234567"
                  />
                </div>

                {/* Responsable */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded-lg">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    Responsable
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    value={currentSucursal.responsable}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                {/* Estado */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="estado"
                    name="estado"
                    checked={currentSucursal.estado === 1}
                    onChange={handleInputChange}
                    className="h-6 w-6 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500"
                  />
                  <label htmlFor="estado" className="text-sm text-gray-700 font-bold flex items-center gap-2">
                    <div className="p-1 bg-emerald-100 rounded-lg">
                     <Power className="w-4 h-4 text-emerald-600" />
                    </div>
                    Activo
                  </label>
                </div>
              </div>

              {/* Mensajes */}
              {submitStatus === 'success' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-800 rounded-xl flex items-center gap-3 border border-green-200">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">¡Operación exitosa!</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">Error al procesar la solicitud</span>
                </div>
              )}

              {/* Botones */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormErrors({});
                    setSubmitStatus(null);
                  }}
                  className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className={`px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                    submitStatus === 'loading'
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {submitStatus === 'loading' ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.37258 0 0 5.37258 0 12h4z"
                        ></path>
                      </svg>
                      Procesando...
                    </div>
                  ) : 'Crear Sucursal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-blue-100">
            <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center bg-gradient-to-r from-green-500 to-blue-600 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Edit className="text-white w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white">Editar Sucursal</h2>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setFormErrors({});
                  setSubmitStatus(null);
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-8 bg-white rounded-b-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nombre */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-purple-100 rounded-lg">
                      <Building className="w-4 h-4 text-purple-600" />
                    </div>
                    Nombre de la Sucursal*
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={currentSucursal.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.nombre 
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Ej: Sucursal Central"
                  />
                  {formErrors.nombre && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.nombre}
                    </p>
                  )}
                </div>

                {/* Código */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Hash className="w-4 h-4 text-blue-600" />
                    </div>
                    Código *
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    value={currentSucursal.codigo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.codigo 
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                    placeholder="Ej: SUC001"
                  />
                  {formErrors.codigo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.codigo}
                    </p>
                  )}
                </div>

                {/* Tipo */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-orange-100 rounded-lg">
                      <List className="w-4 h-4 text-orange-600" />
                    </div>
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    value={currentSucursal.tipo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.tipo 
                        ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                    }`}
                  >
                    <option value="DISTRITO">Distrito</option>
                    <option value="CAJA_RECAUDADORA">Caja Recaudadora</option>
                    <option value="OTRO">Otro</option>
                  </select>
                  {formErrors.tipo && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.tipo}
                    </p>
                  )}
                </div>

                {/* Distrito */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-lg">
                      <Home className="w-4 h-4 text-green-600" />
                    </div>
                    Distrito
                  </label>
                  <input
                    type="text"
                    name="distrito"
                    value={currentSucursal.distrito}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Centro"
                  />
                </div>

                {/* Dirección */}
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-yellow-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                    </div>
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={currentSucursal.direccion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Av. Principal #123"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-red-100 rounded-lg">
                      <Phone className="w-4 h-4 text-red-600" />
                    </div>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={currentSucursal.telefono}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 71234567"
                  />
                </div>

                {/* Responsable */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded-lg">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    Responsable
                  </label>
                  <input
                    type="text"
                    name="responsable"
                    value={currentSucursal.responsable}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                {/* Estado */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="estadoEdit"
                    name="estado"
                    checked={currentSucursal.estado === 1}
                    onChange={handleInputChange}
                    className="h-6 w-6 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500"
                  />
                  <label htmlFor="estadoEdit" className="text-sm text-gray-700 font-bold flex items-center gap-2">
                    <div className="p-1 bg-emerald-100 rounded-lg">
                      <Power className="w-4 h-4 text-emerald-600" />
                    </div>
                    Activo
                  </label>
                </div>
              </div>

              {/* Mensajes */}
              {submitStatus === 'success' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-800 rounded-xl flex items-center gap-3 border border-green-200">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">¡Sucursal actualizada exitosamente!</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">Error al actualizar la sucursal</span>
                </div>
              )}

              {/* Botones */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setFormErrors({});
                    setSubmitStatus(null);
                  }}
                  className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className={`px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                    submitStatus === 'loading'
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {submitStatus === 'loading' ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.37258 0 0 5.37258 0 12h4z"
                        ></path>
                      </svg>
                      Procesando...
                    </div>
                  ) : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-y-auto border-2 border-red-100">
            <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center bg-gradient-to-r from-red-500 to-red-600 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <AlertCircle className="text-white w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-white">Eliminar Sucursal</h2>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteStatus(null);
                  setSucursalToDelete(null);
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-white rounded-b-3xl">
              {deleteStatus !== 'success' && (
                <>
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
                    <p className="text-gray-600 text-lg">
                      Esta acción eliminará permanentemente la sucursal <strong>{sucursalToDelete?.nombre}</strong> y no se puede deshacer.
                    </p>
                  </div>
                  
                  {deleteStatus === 'error' && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-semibold">Error al eliminar la sucursal. Por favor intenta nuevamente.</span>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteStatus(null);
                        setSucursalToDelete(null);
                      }}
                      className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      disabled={deleteStatus === 'loading'}
                      className={`px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                        deleteStatus === 'loading'
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {deleteStatus === 'loading' ? (
                        <div className="flex items-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.37258 0 0 5.37258 0 12h4z"
                            ></path>
                          </svg>
                          Eliminando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-5 h-5" />
                          Eliminar
                        </div>
                      )}
                    </button>
                  </div>
                </>
              )}

              {deleteStatus === 'success' && (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Eliminado Correctamente!</h3>
                  <p className="text-gray-600 text-lg mb-6">La sucursal ha sido eliminada exitosamente.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteStatus(null);
                      setSucursalToDelete(null);
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}