const SUCURSALES_API_URL = 'http://localhost:8083/api/sucursal';

// Obtener todas las sucursales
export const obtenerSucursales = async () => {
  try {
    const response = await fetch(SUCURSALES_API_URL);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerSucursales:', error);
    return [];
  }
};

// Obtener una sucursal por ID
export const obtenerSucursalPorId = async (id) => {
  try {
    const response = await fetch(`${SUCURSALES_API_URL}/${id}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerSucursalPorId:', error);
    return null;
  }
};

// Crear una nueva sucursal
export const crearSucursal = async (nuevaSucursal) => {
  try {
    const response = await fetch(SUCURSALES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaSucursal),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear la sucursal');

    return data;
  } catch (error) {
    console.error('Error en crearSucursal:', error);
    return { success: false, message: 'No se pudo crear la sucursal' };
  }
};

// Editar una sucursal existente
export const editarSucursal = async (id, sucursalActualizada) => {
  try {
    const response = await fetch(`${SUCURSALES_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sucursalActualizada),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar la sucursal');

    return data;
  } catch (error) {
    console.error('Error en editarSucursal:', error);
    return { success: false, message: 'No se pudo actualizar la sucursal' };
  }
};

// Eliminar una sucursal por ID
export const eliminarSucursal = async (id) => {
  try {
    const response = await fetch(`${SUCURSALES_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Agrega otros headers necesarios como Authorization si es requerido
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar la sucursal');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en eliminarSucursal:', error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};

