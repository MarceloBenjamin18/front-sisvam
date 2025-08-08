"use client"

import { useState, useEffect } from "react"
import { obtenerInventario, crearInventario, editarInventario, eliminarInventario } from "../../services/inventario"
import {
  BadgePlus,
  X,
  AlertCircle,
  CheckCircle,
  MapPin,
  Power,
  Edit,
  Trash2,
  Search,
  Grid,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  MessageSquare,
  Hash,
  ArrowUpCircle,
  ArrowDownCircle,
  PlusCircle,
  Building,
  DollarSign,
} from "lucide-react"

// ---------------------- COMPONENTES HIJO ----------------------

const InventarioCard = ({ inventario, index, onEditClick, onDeleteClick }) => {
  const iconColors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-yellow-500 to-yellow-600",
  ]
  const iconClass = iconColors[index % iconColors.length]

  return (
    <div className="group flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 h-full">
      {/* Header con icono y estado */}
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconClass} shadow-lg`}>
          <Package className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col items-end">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-1">
            Lote: {inventario.lote}
          </span>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${inventario.estado === 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 inline-block ${inventario.estado === 1 ? "bg-green-500" : "bg-gray-400"}`}
            ></span>
            {inventario.estado === 1 ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
          Stock Actual: {inventario.stock_actual}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
          <MapPin className="w-4 h-4" />
          <span>{inventario.ubicacion_fisica}</span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {inventario.fecha_vencimiento && (
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Vencimiento: {inventario.fecha_vencimiento}
            </p>
          )}

          {inventario.stock_minimo !== undefined && (
            <p className="flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4" />
              Stock Mínimo: {inventario.stock_minimo}
            </p>
          )}

          {inventario.stock_maximo !== undefined && (
            <p className="flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4" />
              Stock Máximo: {inventario.stock_maximo}
            </p>
          )}

          {inventario.observaciones && (
            <p className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Observaciones: {inventario.observaciones}
            </p>
          )}
        </div>
      </div>

      {/* Sección de botones */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEditClick(inventario)}
          className="group/btn flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
        >
          <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          Editar
        </button>
        <button
          onClick={() => onDeleteClick(inventario)}
          className="group/btn flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          Eliminar
        </button>
      </div>
    </div>
  )
}

const InventarioRow = ({ inventario, onEditClick, onDeleteClick }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 shadow-md">
            <Package className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <div className="text-lg font-semibold text-gray-900">Lote: {inventario.lote}</div>
            <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <Package className="w-4 h-4" />
              Stock Actual: {inventario.stock_actual}
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full ml-2">
                ID: {inventario.id}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
        {inventario.ubicacion_fisica && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {inventario.ubicacion_fisica}
          </div>
        )}
      </td>
      <td className="px-6 py-5 text-sm text-gray-600 font-medium">
        {inventario.fecha_vencimiento && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {inventario.fecha_vencimiento}
          </div>
        )}
      </td>
      <td className="px-6 py-5">
        <span
          className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full shadow-sm ${inventario.estado === 1 ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800" : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"}`}
        >
          {inventario.estado === 1 ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onEditClick(inventario)}
            className="group/btn flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
          >
            <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Editar
          </button>
          <button
            onClick={() => onDeleteClick(inventario)}
            className="group/btn flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

// ---------------------- COMPONENTE PRINCIPAL ----------------------

export default function InventarioPanel() {
  const [inventarios, setInventarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [viewMode, setViewMode] = useState("grid")
  const [activeFilter, setActiveFilter] = useState("all")

  // Estados para los modales
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [inventarioToDelete, setInventarioToDelete] = useState(null)

  // Estado para el formulario - ACTUALIZADO PARA NUEVOS CAMPOS
  const [currentInventario, setCurrentInventario] = useState({
    lote: "",
    stock_actual: 0,
    ubicacion_fisica: "",
    fecha_vencimiento: "",
    stock_maximo: 0,
    stock_minimo: 0,
    stock_inicial: 0,
    sucursal_id: 0,
    valor_municipal_id: 0,
    observaciones: "",
    estado: 1,
  })

  const [formErrors, setFormErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)
  const [deleteStatus, setDeleteStatus] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerInventario()
        setInventarios(data)
      } catch (err) {
        console.error("Error fetching inventarios:", err)
        setError("Error al cargar los registros de inventario")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Manejador de cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCurrentInventario({
      ...currentInventario,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : type === "number" ? Number(value) : value,
    })
  }

  // Validación del formulario - ACTUALIZADO PARA NUEVOS CAMPOS
  const validateForm = () => {
    const errors = {}
    if (!currentInventario.lote.trim()) errors.lote = "El lote es requerido"
    if (currentInventario.stock_actual === null || currentInventario.stock_actual < 0)
      errors.stock_actual = "El stock actual es requerido y debe ser un número positivo"
    if (!currentInventario.ubicacion_fisica.trim()) errors.ubicacion_fisica = "La ubicación física es requerida"
    return errors
  }

  // Manejador para crear un nuevo inventario
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setSubmitStatus("loading")
      const result = await crearInventario(currentInventario)

      if (result.success) {
        setSubmitStatus("success")
        const data = await obtenerInventario()
        setInventarios(data)

        setTimeout(() => {
          setShowCreateModal(false)
          setSubmitStatus(null)
          resetForm()
        }, 1500)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error creating inventario:", error)
      setSubmitStatus("error")
    }
  }

  // Manejador para editar un inventario
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setSubmitStatus("loading")
      const result = await editarInventario(currentInventario.id, currentInventario)

      if (result.success) {
        setSubmitStatus("success")
        const data = await obtenerInventario()
        setInventarios(data)

        setTimeout(() => {
          setShowEditModal(false)
          setSubmitStatus(null)
          resetForm()
        }, 1500)
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error editing inventario:", error)
      setSubmitStatus("error")
    }
  }

  // Resetear el formulario - ACTUALIZADO PARA NUEVOS CAMPOS
  const resetForm = () => {
    setCurrentInventario({
      lote: "",
      stock_actual: 0,
      ubicacion_fisica: "",
      fecha_vencimiento: "",
      stock_maximo: 0,
      stock_minimo: 0,
      stock_inicial: 0,
      sucursal_id: 0,
      valor_municipal_id: 0,
      observaciones: "",
      estado: 1,
    })
    setFormErrors({})
  }

  // Manejador para el clic en editar - ACTUALIZADO PARA NUEVOS CAMPOS
  const handleEditClick = (inventario) => {
    setCurrentInventario({
      id: inventario.id,
      lote: inventario.lote || "",
      stock_actual: inventario.stock_actual ?? 0,
      ubicacion_fisica: inventario.ubicacion_fisica || "",
      fecha_vencimiento: inventario.fecha_vencimiento || "",
      stock_maximo: inventario.stock_maximo ?? 0,
      stock_minimo: inventario.stock_minimo ?? 0,
      stock_inicial: inventario.stock_inicial ?? 0,
      sucursal_id: inventario.sucursal_id ?? 0,
      valor_municipal_id: inventario.valor_municipal_id ?? 0,
      observaciones: inventario.observaciones || "",
      estado: inventario.estado ?? 1,
    })
    setShowEditModal(true)
  }

  // Manejador para el clic en eliminar
  const handleDeleteClick = (inventario) => {
    setInventarioToDelete(inventario)
    setShowDeleteModal(true)
  }

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      setDeleteStatus("loading")
      const result = await eliminarInventario(inventarioToDelete.id)

      if (result.success) {
        setDeleteStatus("success")
        const data = await obtenerInventario()
        setInventarios(data)

        setTimeout(() => {
          setShowDeleteModal(false)
          setDeleteStatus(null)
          setInventarioToDelete(null)
        }, 1500)
      } else {
        setDeleteStatus("error")
      }
    } catch (error) {
      console.error("Error deleting inventario:", error)
      setDeleteStatus("error")
    }
  }

  // Filtrar y paginar inventarios - ACTUALIZADO PARA NUEVOS CAMPOS
  const filteredInventarios = inventarios.filter((inventario) => {
    const matchesSearch =
      (inventario.lote ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inventario.ubicacion_fisica ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inventario.observaciones ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inventario.id?.toString() ?? "").includes(searchQuery) ||
      (inventario.stock_actual?.toString() ?? "").includes(searchQuery)

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && inventario.estado === 1) ||
      (activeFilter === "inactive" && inventario.estado !== 1)

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredInventarios.length / itemsPerPage)
  const paginatedInventarios = filteredInventarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Renderizado condicional para estados de carga/error
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando registros de inventario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Error al cargar los datos</h3>
          <p className="text-gray-600 mb-6">
            No se pudieron cargar los registros de inventario. Por favor intenta nuevamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
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
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Inventario</h1>
              <p className="text-blue-100 text-lg font-medium">Sistema de gestión de inventario</p>
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
              placeholder="Buscar por lote, ubicación, observaciones o ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {filteredInventarios.length} registros encontrados
                </h2>
                <p className="text-gray-500">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredInventarios.length)} de {filteredInventarios.length}
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
                      setCurrentPage(1)
                      setItemsPerPage(Number(e.target.value))
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
                    {
                      label: "Todos",
                      key: "all",
                      gradient: "from-blue-500 to-blue-600",
                      hoverGradient: "from-blue-600 to-blue-700",
                    },
                    {
                      label: "Activos",
                      key: "active",
                      gradient: "from-green-500 to-green-600",
                      hoverGradient: "from-green-600 to-green-700",
                    },
                    {
                      label: "Inactivos",
                      key: "inactive",
                      gradient: "from-gray-500 to-gray-600",
                      hoverGradient: "from-gray-600 to-gray-700",
                    },
                  ].map(({ label, key, gradient, hoverGradient }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveFilter(key)
                        setCurrentPage(1)
                      }}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 ${
                        activeFilter === key
                          ? `bg-gradient-to-r ${gradient} hover:${hoverGradient} text-white shadow-xl`
                          : `bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:shadow-xl`
                      }`}
                    >
                      {activeFilter === key && <CheckCircle className="w-4 h-4" />}
                      {label}
                    </button>
                  ))}
                </div>

                {/* Botón Nuevo Registro de Inventario mejorado */}
                <button
                  onClick={() => {
                    resetForm()
                    setShowCreateModal(true)
                  }}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <BadgePlus className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  Nuevo Registro
                </button>

                {/* Vista mejorada */}
                <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-md">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100"
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
            {filteredInventarios.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-300 text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No se encontraron resultados</h3>
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? `No hay registros de inventario que coincidan con "${searchQuery}"`
                    : "No hay registros de inventario disponibles"}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {paginatedInventarios.map((inventario, index) => (
                  <InventarioCard
                    key={inventario.id}
                    inventario={inventario}
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
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Registro
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Ubicación Física
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Fecha Vencimiento
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedInventarios.map((inventario) => (
                      <InventarioRow
                        key={inventario.id}
                        inventario={inventario}
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
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white text-blue-600 hover:bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : "bg-white text-blue-600 hover:bg-blue-50 border-blue-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
                <h2 className="text-2xl font-bold text-white">Crear Nuevo Registro de Inventario</h2>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setFormErrors({})
                  setSubmitStatus(null)
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-8 space-y-8 bg-white rounded-b-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lote */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-purple-100 rounded-lg">
                      <Hash className="w-4 h-4 text-purple-600" />
                    </div>
                    Lote *
                  </label>
                  <input
                    type="text"
                    name="lote"
                    value={currentInventario.lote}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.lote
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                    placeholder="Ej: L123-XYZ"
                  />
                  {formErrors.lote && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.lote}
                    </p>
                  )}
                </div>

                {/* Stock Actual */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    Stock Actual *
                  </label>
                  <input
                    type="number"
                    name="stock_actual"
                    value={currentInventario.stock_actual}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.stock_actual
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                    placeholder="Ej: 80"
                  />
                  {formErrors.stock_actual && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.stock_actual}
                    </p>
                  )}
                </div>

                {/* Ubicación Física */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-orange-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    Ubicación Física *
                  </label>
                  <input
                    type="text"
                    name="ubicacion_fisica"
                    value={currentInventario.ubicacion_fisica}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.ubicacion_fisica
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                    placeholder="Ej: Almacén A - Estante 3"
                  />
                  {formErrors.ubicacion_fisica && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.ubicacion_fisica}
                    </p>
                  )}
                </div>

                {/* Fecha Vencimiento */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_vencimiento"
                    value={currentInventario.fecha_vencimiento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Stock Mínimo */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-red-100 rounded-lg">
                      <ArrowDownCircle className="w-4 h-4 text-red-600" />
                    </div>
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={currentInventario.stock_minimo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 20"
                  />
                </div>

                {/* Stock Máximo */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded-lg">
                      <ArrowUpCircle className="w-4 h-4 text-indigo-600" />
                    </div>
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    name="stock_maximo"
                    value={currentInventario.stock_maximo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 150"
                  />
                </div>

                {/* Stock Inicial */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-yellow-100 rounded-lg">
                      <PlusCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    name="stock_inicial"
                    value={currentInventario.stock_inicial}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 100"
                  />
                </div>

                {/* Sucursal ID */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-cyan-100 rounded-lg">
                      <Building className="w-4 h-4 text-cyan-600" />
                    </div>
                    ID Sucursal
                  </label>
                  <input
                    type="number"
                    name="sucursal_id"
                    value={currentInventario.sucursal_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 5"
                  />
                </div>

                {/* Valor Municipal ID */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-pink-100 rounded-lg">
                      <DollarSign className="w-4 h-4 text-pink-600" />
                    </div>
                    ID Valor Municipal
                  </label>
                  <input
                    type="number"
                    name="valor_municipal_id"
                    value={currentInventario.valor_municipal_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 101"
                  />
                </div>

                {/* Observaciones */}
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-teal-100 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                    </div>
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={currentInventario.observaciones}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Lote en buen estado, próximo a vencer"
                  ></textarea>
                </div>

                {/* Estado */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="estado"
                    name="estado"
                    checked={currentInventario.estado === 1}
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
              {submitStatus === "success" && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-800 rounded-xl flex items-center gap-3 border border-green-200">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">¡Operación exitosa!</span>
                </div>
              )}
              {submitStatus === "error" && (
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
                    setShowCreateModal(false)
                    setFormErrors({})
                    setSubmitStatus(null)
                  }}
                  className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className={`px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                    submitStatus === "loading"
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {submitStatus === "loading" ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.37258 0 0 5.37258 0 12h4z"
                        ></path>
                      </svg>
                      Procesando...
                    </div>
                  ) : (
                    "Crear Registro"
                  )}
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
                <h2 className="text-2xl font-bold text-white">Editar Registro de Inventario</h2>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setFormErrors({})
                  setSubmitStatus(null)
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-8 bg-white rounded-b-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Lote */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-purple-100 rounded-lg">
                      <Hash className="w-4 h-4 text-purple-600" />
                    </div>
                    Lote *
                  </label>
                  <input
                    type="text"
                    name="lote"
                    value={currentInventario.lote}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.lote
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                    placeholder="Ej: L123-XYZ"
                  />
                  {formErrors.lote && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.lote}
                    </p>
                  )}
                </div>

                {/* Stock Actual */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded-lg">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    Stock Actual *
                  </label>
                  <input
                    type="number"
                    name="stock_actual"
                    value={currentInventario.stock_actual}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.stock_actual
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                    placeholder="Ej: 80"
                  />
                  {formErrors.stock_actual && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.stock_actual}
                    </p>
                  )}
                </div>

                {/* Ubicación Física */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-orange-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    Ubicación Física *
                  </label>
                  <input
                    type="text"
                    name="ubicacion_fisica"
                    value={currentInventario.ubicacion_fisica}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-200 ${
                      formErrors.ubicacion_fisica
                        ? "border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100"
                        : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    }`}
                    placeholder="Ej: Almacén A - Estante 3"
                  />
                  {formErrors.ubicacion_fisica && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.ubicacion_fisica}
                    </p>
                  )}
                </div>

                {/* Fecha Vencimiento */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_vencimiento"
                    value={currentInventario.fecha_vencimiento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                </div>

                {/* Stock Mínimo */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-red-100 rounded-lg">
                      <ArrowDownCircle className="w-4 h-4 text-red-600" />
                    </div>
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stock_minimo"
                    value={currentInventario.stock_minimo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 20"
                  />
                </div>

                {/* Stock Máximo */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded-lg">
                      <ArrowUpCircle className="w-4 h-4 text-indigo-600" />
                    </div>
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    name="stock_maximo"
                    value={currentInventario.stock_maximo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 150"
                  />
                </div>

                {/* Stock Inicial */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-yellow-100 rounded-lg">
                      <PlusCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    name="stock_inicial"
                    value={currentInventario.stock_inicial}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 100"
                  />
                </div>

                {/* Sucursal ID */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-cyan-100 rounded-lg">
                      <Building className="w-4 h-4 text-cyan-600" />
                    </div>
                    ID Sucursal
                  </label>
                  <input
                    type="number"
                    name="sucursal_id"
                    value={currentInventario.sucursal_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 5"
                  />
                </div>

                {/* Valor Municipal ID */}
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-pink-100 rounded-lg">
                      <DollarSign className="w-4 h-4 text-pink-600" />
                    </div>
                    ID Valor Municipal
                  </label>
                  <input
                    type="number"
                    name="valor_municipal_id"
                    value={currentInventario.valor_municipal_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: 101"
                  />
                </div>

                {/* Observaciones */}
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <div className="p-1 bg-teal-100 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-teal-600" />
                    </div>
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    value={currentInventario.observaciones}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    placeholder="Ej: Lote en buen estado, próximo a vencer"
                  ></textarea>
                </div>

                {/* Estado */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="estadoEdit"
                    name="estado"
                    checked={currentInventario.estado === 1}
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
              {submitStatus === "success" && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-800 rounded-xl flex items-center gap-3 border border-green-200">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">¡Registro de inventario actualizado exitosamente!</span>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">Error al actualizar el registro de inventario</span>
                </div>
              )}

              {/* Botones */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setFormErrors({})
                    setSubmitStatus(null)
                  }}
                  className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className={`px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                    submitStatus === "loading"
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {submitStatus === "loading" ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.37258 0 0 5.37258 0 12h4z"
                        ></path>
                      </svg>
                      Procesando...
                    </div>
                  ) : (
                    "Guardar Cambios"
                  )}
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
                <h2 className="text-2xl font-bold text-white">Eliminar Registro de Inventario</h2>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteStatus(null)
                  setInventarioToDelete(null)
                }}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-white rounded-b-3xl">
              {deleteStatus !== "success" && (
                <>
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
                    <p className="text-gray-600 text-lg">
                      Esta acción eliminará permanentemente el registro{" "}
                      <strong>{inventarioToDelete?.lote || inventarioToDelete?.id}</strong> y no se puede deshacer.
                    </p>
                  </div>

                  {deleteStatus === "error" && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-800 rounded-xl flex items-center gap-3 border border-red-200">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-semibold">
                        Error al eliminar el registro de inventario. Por favor intenta nuevamente.
                      </span>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(false)
                        setDeleteStatus(null)
                        setInventarioToDelete(null)
                      }}
                      className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      disabled={deleteStatus === "loading"}
                      className={`px-8 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 ${
                        deleteStatus === "loading"
                          ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {deleteStatus === "loading" ? (
                        <div className="flex items-center gap-3">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
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

              {deleteStatus === "success" && (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Eliminado Correctamente!</h3>
                  <p className="text-gray-600 text-lg mb-6">
                    El registro de inventario ha sido eliminado exitosamente.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDeleteStatus(null)
                      setInventarioToDelete(null)
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
  )
}
