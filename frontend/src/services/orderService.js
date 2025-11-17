const API_URL = 'http://localhost:8080/api/orders';

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
        throw new Error(`Error ${response.status}: No se pudo procesar la solicitud`);
    }

    return null;
};

const handleError = (error) => {
    if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar con el servidor');
    }
    throw error;
};

export const orderService = {
    // Crear pedido
    createOrder: async (orderData, token) => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Obtener mis pedidos
    getMyOrders: async (token) => {
        try {
            const response = await fetch(`${API_URL}/my-orders`, {
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

    // Obtener pedido por ID
    getOrderById: async (id, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
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

    // Cancelar pedido
    cancelOrder: async (id, reason, token) => {
        try {
            const url = reason
                ? `${API_URL}/${id}/cancel?reason=${encodeURIComponent(reason)}`
                : `${API_URL}/${id}/cancel`;

            const response = await fetch(url, {
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

    // ====== ENDPOINTS ADMIN ======

    // Obtener todos los pedidos
    getAllOrders: async (token) => {
        try {
            const response = await fetch(`${API_URL}/all`, {
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

    // Obtener pedidos por estado
    getOrdersByStatus: async (status, token) => {
        try {
            const response = await fetch(`${API_URL}/status/${status}`, {
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

    // Actualizar estado
    updateOrderStatus: async (id, status, token) => {
        try {
            const response = await fetch(`${API_URL}/${id}/status?status=${status}`, {
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

    // Obtener estadísticas
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

    // Obtener estados disponibles
    getStatuses: async () => {
        try {
            const response = await fetch(`${API_URL}/statuses`, {
                method: 'GET',
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Obtener métodos de pago
    getPaymentMethods: async () => {
        try {
            const response = await fetch(`${API_URL}/payment-methods`, {
                method: 'GET',
            });
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },
};