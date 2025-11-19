export const integrationService = {

    getMyProducts: async () => {
        const res = await fetch("http://localhost:8080/api/integration/products");
        return res.json();
    },

    getExternalProducts: async () => {
        const res = await fetch("http://localhost:5000/products"); 
        return res.json();
    }
};