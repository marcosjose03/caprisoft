const API_URL = 'http://localhost:8080/api/auth';

// Función helper para manejar respuestas
const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    // Si la respuesta es JSON
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Error en la solicitud');
        }

        return data;
    }

    // Si no es JSON (error del servidor, HTML, etc.)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Servicio no encontrado. Verifica que el backend esté corriendo.');
        }
        if (response.status === 500) {
            throw new Error('Error del servidor. Por favor intenta de nuevo.');
        }
        if (response.status === 401) {
            throw new Error('Credenciales inválidas');
        }
        if (response.status === 403) {
            throw new Error('Acceso denegado');
        }
        throw new Error(`Error ${response.status}: No se pudo procesar la solicitud`);
    }

    return null;
};

// Función helper para manejar errores de conexión
const handleError = (error) => {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080');
    }
    throw error;
};

export const authService = {
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    register: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            return await handleResponse(response);
        } catch (error) {
            handleError(error);
        }
    },

    validateResetToken: async (token) => {
        try {
            const response = await fetch(`${API_URL}/validate-reset-token?token=${token}`, {
                method: 'GET',
            });

            const data = await handleResponse(response);
            return data.valid === true;
        } catch (error) {
            return false;
        }
    },
};