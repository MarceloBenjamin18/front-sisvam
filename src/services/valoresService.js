// services/valoresService.js
const VALORES_API_URL = 'http://localhost:8082/api/valors';

export const obtenerValores = async () => {
  try {
    const response = await fetch(VALORES_API_URL);
    if (!response.ok) {
      throw new Error(`Error al obtener los valores: ${response.status}`);
    }
    const data = await response.json();
    console.log('Datos recibidos de la API:', data); // Para debug
    return data;
  } catch (error) {
    console.error('Error en obtenerValores:', error);
    return [];
  }
};

// Función adicional para obtener un valor específico por ID
export const obtenerValorPorId = async (id) => {
  try {
    const response = await fetch(`${VALORES_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el valor: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en obtenerValorPorId:', error);
    return null;
  }
};
// crear valores 
export const crearValor = async (data) => {
  try {
    const response = await fetch(VALORES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al crear valor');
    }

    return result;
  } catch (error) {
    console.error('Error al crear el valor:', error);
    throw error;
  }
};
