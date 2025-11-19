import React, { useEffect, useState } from "react";
import { integrationService } from "../services/integrationService";

const ExternalProductsReport = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [externalProducts, setExternalProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const mine = await integrationService.getMyProducts();
        const external = await integrationService.getExternalProducts();
        setMyProducts(mine);
        setExternalProducts(external);
        setLoading(false);
    };

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reporte de Productos Integrados</h1>

            {/* Tabla de MIS productos */}
            <h2 className="text-xl font-semibold mt-4 mb-2">Mis productos</h2>
            <table className="border w-full mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Unidad</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {myProducts.map(p => (
                        <tr key={p.id} className="border">
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.unit}</td>
                            <td>{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Tabla de productos EXTERNOS */}
            <h2 className="text-xl font-semibold mb-2">Productos del otro sistema</h2>
            <table className="border w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Unidad</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {externalProducts.map(p => (
                        <tr key={p.id} className="border">
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.unit}</td>
                            <td>{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExternalProductsReport;