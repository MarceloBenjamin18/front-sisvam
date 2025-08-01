import React, { useState, useEffect } from "react";
import { obtenerValores, crearValor } from "../../services/valoresService";
import { BadgePlus, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Type, // Este es el icono que debes usar en lugar de Text
  Hash, 
  FileText, 
  AlignLeft, 
  List, 
  Ruler, 
  Gauge, 
  DollarSign, 
  Banknote, 
  Stamp, 
  FileBadge, 
  Power, 
  Save  } from 'lucide-react';
import { MdOutlineToggleOn } from "react-icons/md";
// Añade estas importaciones al inicio de tu archivo


const ValueCard = ({ valor, index }) => {
  const iconColors = [
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-yellow-500 text-white'
  ];
  const iconClass = iconColors[index % iconColors.length];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl shadow-md border border-gray-200">
      {/* Icono */}
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconClass}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C8.67 6.165 8 7.388 8 8.75V14a2 2 0 01-.595 1.405L6 17h5"
          />
        </svg>
      </div>

      {/* Contenido */}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-800">{valor.nombre}</h3>
        <p className="text-xs text-gray-500">{valor.sigla} • {valor.tipo}</p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{valor.descripcion}</p>
      </div>

      {/* Estado y costo */}
      <div className="flex flex-col items-end text-right">
        <span className="text-blue-600 font-semibold text-sm">{valor.costo.toFixed(2)} Bs</span>
        <span className={`mt-1 text-xs inline-flex items-center ${valor.estado === 1 ? 'text-green-600' : 'text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full mr-1 ${valor.estado === 1 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {valor.estado === 1 ? 'Activo' : 'Inactivo'}
        </span>
      </div>
    </div>
  );
};

const ValueRow = ({ valor }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{valor.nombre}</div>
          <div className="text-sm text-gray-500">{valor.sigla}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">{valor.tipo}</td>
    <td className="px-6 py-4">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${valor.estado === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {valor.estado === 1 ? 'Activo' : 'Inactivo'}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-900">{valor.costo.toFixed(2)} Bs</td>
    <td className="px-6 py-4 text-right text-sm font-medium">
      <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
      <button className="text-gray-600 hover:text-gray-900">Editar</button>
    </td>
  </tr>
);

export default function CompleteValuesPanel() {
  const [valores, setValores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newValor, setNewValor] = useState({
    nombre: "",
    sigla: "",
    descripcion: "",
    tipo: "",
    medida: "",
    costo: 0.00,
    timbre: 0.00,
    estado: 1
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerValores();
        setValores(data);
      } catch (err) {
        console.error('Error fetching values:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewValor({
      ...newValor,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!newValor.nombre.trim()) errors.nombre = "El nombre es requerido";
    if (!newValor.sigla.trim()) errors.sigla = "La sigla es requerida";
    if (newValor.costo <= 0) errors.costo = "El costo debe ser mayor a 0";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitStatus('loading');
      await crearValor(newValor);
      setSubmitStatus('success');
      
      const data = await obtenerValores();
      setValores(data);
      
      setTimeout(() => {
        setShowCreateModal(false);
        setSubmitStatus(null);
        setNewValor({
          nombre: "",
          sigla: "",
          descripcion: "",
          tipo: "moneda",
          medida: "unidad",
          costo: 0.00,
          timbre: 0.00,
          estado: 1
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating value:', error);
      setSubmitStatus('error');
    }
  };

  const filteredValues = valores.filter(valor => {
    const matchesSearch = valor.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      valor.sigla.toLowerCase().includes(searchQuery.toLowerCase()) ||
      valor.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'active' && valor.estado === 1) ||
      (activeFilter === 'inactive' && valor.estado !== 1);

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredValues.length / itemsPerPage);
  const paginatedValues = filteredValues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error al cargar los datos</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar los valores municipales. Por favor intenta nuevamente.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Panel superior */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-48 w-full shadow-md">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Valores Municipales</h1>
              <p className="text-blue-100">Sistema de gestión de valores del municipio</p>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="mt-6 relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-500 shadow-sm"
              placeholder="Buscar valores por nombre, sigla o descripción..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 -mt-12 mb-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{filteredValues.length} valores encontrados</h2>
                <p className="text-gray-500 text-sm">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredValues.length)} de {filteredValues.length}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Selector de cantidad */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Mostrar:</label>
                  <select
                    className="text-sm border rounded-md px-2 py-1 bg-white"
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

               {/* Filtros y botón Nuevo Valor */}
<div className="flex justify-between items-center">
  <div className="flex gap-1">
    {[
      { label: "Todos", key: "all", color: "blue" },
      { label: "Activos", key: "active", color: "green" },
      { label: "Inactivos", key: "inactive", color: "red" },
    ].map(({ label, key, color }) => (
      <button
        key={key}
        onClick={() => {
          setActiveFilter(key);
          setCurrentPage(1);
        }}
        className={`flex items-center gap-1 px-3 py-1 text-sm rounded-lg shadow-md transition-colors ${
          activeFilter === key
            ? `bg-${color}-600 hover:bg-${color}-700 text-white`
            : `bg-white border border-gray-300 hover:bg-gray-50 text-gray-700`
        }`}
      >
        {activeFilter === key && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {label}
      </button>
    ))}
  </div>

  <button
    onClick={() => setShowCreateModal(true)}
    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg shadow-md font-medium hover:bg-blue-700 transition-colors"
  >
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    Nuevo Valor
  </button>
</div>

                {/* Vista */}
                <div className="flex border border-gray-200 rounded-lg p-0.5 bg-gray-100">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  >
                    📦
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista o grid */}
          <div className="p-6">
            {filteredValues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No se encontraron resultados</h3>
                <p className="text-gray-500">
                  {searchQuery ? `No hay valores que coincidan con "${searchQuery}"` : "No hay valores disponibles"}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedValues.map((valor, index) => (
                  <ValueCard key={valor.id} valor={valor} index={index} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedValues.map((valor) => (
                      <ValueRow key={valor.id} valor={valor} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border-gray-300'}`}
                >
                  Anterior
                </button>
                <div className="text-gray-600">Página {currentPage} de {totalPages}</div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 hover:bg-blue-50 border-gray-300'}`}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    {showCreateModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-blue-100">
      
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-blue-100 rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <BadgePlus className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-bold text-blue-800">Crear Nuevo Valor Municipal</h2>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(false);
            setFormErrors({});
            setSubmitStatus(null);
          }}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded-b-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nombre */}
<div>
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <Type className="w-4 h-4 text-purple-600" /> Nombre del Valor Municipal*
  </label>
  <div className="relative">
    <input
      type="text"
      name="nombre"
      value={newValor.nombre}
      onChange={handleInputChange}
      className={`w-full pl-4 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
        formErrors.nombre ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
      }`}
      placeholder="Ej: Impuesto de Alumbrado"
    />
  </div>
</div>

{/* Sigla */}
<div>
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <Hash className="w-4 h-4 text-blue-600" /> Sigla *
  </label>
  <input
    type="text"
    name="sigla"
    value={newValor.sigla}
    onChange={handleInputChange}
    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
      formErrors.sigla ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
    }`}
    placeholder="Ej: IA"
  />
</div>

{/* Descripción */}
<div className="md:col-span-2">
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <AlignLeft className="w-4 h-4 text-green-600" /> Descripción
  </label>
  <textarea
    name="descripcion"
    value={newValor.descripcion}
    onChange={handleInputChange}
    rows="3"
    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    placeholder="Descripción detallada del valor municipal"
  />
</div>

{/* Tipo */}
<div>
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <List className="w-4 h-4 text-orange-600" /> Tipo *
  </label>
  <input
    type="text"
    name="tipo"
    value={newValor.tipo}
    onChange={handleInputChange}
    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    placeholder="Ej: Correlativo"
  />
</div>

{/* Medida */}
<div>
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <Gauge className="w-4 h-4 text-red-600" /> Medida *
  </label>
  <input
    type="text"
    name="medida"
    value={newValor.medida}
    onChange={handleInputChange}
    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    placeholder="Ej: Unidad"
  />
</div>

{/* Costo */}
<div>
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <Banknote className="w-4 h-4 text-amber-600" /> Costo (Bs) *
  </label>
  <input
    type="number"
    name="costo"
    value={newValor.costo}
    onChange={handleInputChange}
    step="0.01"
    min="0"
    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
      formErrors.costo ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
    }`}
    placeholder="Ej: 10.00"
  />
</div>

{/* Timbre */}
<div>
  <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
    <FileBadge className="w-4 h-4 text-indigo-600" /> Timbre *
  </label>
  <select
    name="timbre"
    value={newValor.timbre}
    onChange={handleInputChange}
    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
  >
    <option value="1">Sí</option>
    <option value="0">No</option>
  </select>
</div>

{/* Estado */}
<div className="md:col-span-2 flex items-center gap-2">
  <input
    type="checkbox"
    id="estado"
    name="estado"
    checked={newValor.estado === 1}
    onChange={handleInputChange}
    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
  <label htmlFor="estado" className="text-sm text-gray-700 font-medium flex items-center gap-1">
    <Power className="w-4 h-4 text-emerald-600" /> Activo
  </label>
</div>

        </div>

        {/* Mensajes */}
        {submitStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Valor creado exitosamente!
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Error al crear el valor. Por favor intenta nuevamente.
          </div>
        )}

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setShowCreateModal(false);
              setFormErrors({});
              setSubmitStatus(null);
            }}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${
              submitStatus === 'loading'
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitStatus === 'loading' ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37258 0 0 5.37258 0 12h4z"
                  ></path>
                </svg>
                Procesando...
              </div>
            ) : 'Crear Valor'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}