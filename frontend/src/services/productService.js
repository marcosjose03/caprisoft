const API_URL = 'http://localhost:8080/api/products';

// Helper para manejar respuestas
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Error en la solicitud');
        }

        return data;
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Producto no encontrado');
        }
        if (response.status === 500) {
            throw new Error('Error del servidor');
        }
        throw new Error(`Error ${response.status}`);
    }

    return null;
};

const handleError = (error) => {
    if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar con el servidor');
    }
    throw error;
};

export const productService = {
    // Obtener todos los productos
    getAllProducts: async () => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Obtener producto por ID
    getProductById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Buscar por categoría
    getProductsByCategory: async (category) => {
        try {
            const response = await fetch(`${API_URL}/category/${category}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Buscar por estado
    getProductsByStatus: async (status) => {
        try {
            const response = await fetch(`${API_URL}/status/${status}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Buscar por nombre
    searchProducts: async (name) => {
        try {
            const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(name)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Obtener categorías
    getCategories: async () => {
        try {
            const response = await fetch(`${API_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // ====== ENDPOINTS PROTEGIDOS (Requieren token) ======

    // Crear producto (Solo ADMIN)
    createProduct: async (productData, token) => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Actualizar producto (Solo ADMIN)
    updateProduct: async (id, productData, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(productData),
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Eliminar producto (Solo ADMIN)
    deleteProduct: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Agregar stock (Solo ADMIN)
    addStock: async (id, quantity, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}/stock/add?quantity=${quantity}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Reducir stock (Solo ADMIN)
    reduceStock: async (id, quantity, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}/stock/reduce?quantity=${quantity}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Marcar como agotado (Solo ADMIN)
    markAsOutOfStock: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}/out-of-stock`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Obtener productos con stock bajo (Solo ADMIN)
    getLowStockProducts: async (threshold, token) => {
        try {
            const response = await fetch(`${API_URL}/low-stock?threshold=${threshold}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Obtener estadísticas (Solo ADMIN)
    getStats: async (token) => {
        try {
            const response = await fetch(`${API_URL}/stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },
};
