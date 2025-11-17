const API_URL = 'http://localhost:8080/api/dashboard';

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
    throw new Error(`Error ${response.status}`);
  }
  
  return null;
};

export const dashboardService = {
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
      throw error;
    }
  },
};