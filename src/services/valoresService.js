const VALORES_API_URL = 'http://localhost:8082/api/valors';

export const obtenerValores = async () => {
  try {
    const response = await fetch(VALORES_API_URL);
    if (!response.ok) {
      throw new Error(`Error al obtener los valores: ${response.status}`);
    }
    const data = await response.json();
    console.log('Datos recibidos de la API:', data);
    return data;
  } catch (error) {
    console.error('Error en obtenerValores:', error);
    return [];
  }
};

export const obtenerValorPorId = async (id) => {
  try {
    const response = await fetch(`${VALORES_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el valor: ${response.status}`);
    }
    const data = await response.json();
    console.log('Datos recibidos por ID:', data);
    return data;
  } catch (error) {
    console.error(`Error al obtener valor con ID ${id}:`, error);
    return null;
  }
};

export const crearValor = async (data) => {
  try {
    console.log('Enviando datos para creación:', data);
    
    const response = await fetch(VALORES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Respuesta del servidor (creación):', response);

    const result = await response.json();
    console.log('Resultado de creación:', result);

    if (!response.ok) {
      const errorMsg = result.message || `Error ${response.status}: ${response.statusText}`;
      console.error('Error en la respuesta (creación):', errorMsg);
      throw new Error(errorMsg);
    }

    return result;
  } catch (error) {
    console.error('Error al crear el valor:', error);
    throw error;
  }
};

export const editarValor = async (id, data) => {
  try {
    console.log('Enviando datos para edición:', { id, data });
    
    const response = await fetch(`${VALORES_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Respuesta del servidor (edición):', response);

    const result = await response.json();
    console.log('Resultado de edición:', result);

    if (!response.ok) {
      const errorMsg = result.message || `Error ${response.status}: ${response.statusText}`;
      console.error('Error en la respuesta (edición):', errorMsg);
      throw new Error(errorMsg);
    }

    return result;
  } catch (error) {
    console.error('Error al editar el valor:', error);
    throw error;
  }
};

// Opcional: función para eliminar valores
export const eliminarValor = async (id) => {
  try {
    console.log('Eliminando valor con ID:', id);
    
    const response = await fetch(`${VALORES_API_URL}/${id}`, {
      method: 'DELETE',
    });

    console.log('Respuesta del servidor (eliminación):', response);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.message || `Error ${response.status}: ${response.statusText}`;
      console.error('Error en la respuesta (eliminación):', errorMsg);
      throw new Error(errorMsg);
    }

    return true;
  } catch (error) {
    console.error('Error al eliminar el valor:', error);
    throw error;
  }
};