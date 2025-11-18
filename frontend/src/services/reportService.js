const API_URL = 'http://localhost:8080/api/reports';

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

export const reportService = {
    // Informe Tabular de Pedidos
    getOrdersReport: async (startDate, endDate, token) => {
        try {
            const response = await fetch(
                `${API_URL}/orders?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Estadísticas Generales
    getStatisticsReport: async (startDate, endDate, token) => {
        try {
            const response = await fetch(
                `${API_URL}/statistics?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Ventas por Producto
    getSalesByProduct: async (startDate, endDate, token) => {
        try {
            const response = await fetch(
                `${API_URL}/sales-by-product?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Ventas por Categoría
    getSalesByCategory: async (startDate, endDate, token) => {
        try {
            const response = await fetch(
                `${API_URL}/sales-by-category?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Ventas Mensuales
    getSalesByMonth: async (startDate, endDate, token) => {
        try {
            const response = await fetch(
                `${API_URL}/sales-by-month?startDate=${startDate}&endDate=${endDate}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    // Top Clientes
    getTopCustomers: async (startDate, endDate, limit, token) => {
        try {
            const response = await fetch(
                `${API_URL}/top-customers?startDate=${startDate}&endDate=${endDate}&limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },
};