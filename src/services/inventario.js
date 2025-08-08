const INVENTARIO_API_URL = "http://localhost:8084/api/inventario"

// Obtener todos los registros de inventario
export const obtenerInventario = async () => {
  try {
    const response = await fetch(INVENTARIO_API_URL)
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error en obtenerInventario:", error)
    return []
  }
}

// Obtener un inventario por ID
export const obtenerInventarioPorId = async (id) => {
  try {
    const response = await fetch(`${INVENTARIO_API_URL}/${id}`)
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error en obtenerInventarioPorId:", error)
    return null
  }
}

// Crear nuevo inventario
export const crearInventario = async (nuevoInventario) => {
  try {
    const response = await fetch(INVENTARIO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoInventario),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Error al crear inventario")

    return data
  } catch (error) {
    console.error("Error en crearInventario:", error)
    return { success: false, message: "No se pudo crear el inventario" }
  }
}

// Editar inventario existente
export const editarInventario = async (id, inventarioActualizado) => {
  try {
    const response = await fetch(`${INVENTARIO_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inventarioActualizado),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Error al actualizar inventario")

    return data
  } catch (error) {
    console.error("Error en editarInventario:", error)
    return { success: false, message: "No se pudo actualizar el inventario" }
  }
}

// Eliminar inventario por ID
export const eliminarInventario = async (id) => {
  try {
    const response = await fetch(`${INVENTARIO_API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Agrega headers como Authorization si aplica
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al eliminar inventario")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en eliminarInventario:", error)
    throw error
  }
}
