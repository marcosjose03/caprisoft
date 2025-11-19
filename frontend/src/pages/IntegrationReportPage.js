import React, { useEffect, useState } from "react";
import { integrationService } from "../services/integrationService"; 
import "../styles/IntegrationReport.css";

const IntegrationReportPage = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [externalProducts, setExternalProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Filtros ---
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [unitFilter, setUnitFilter] = useState("");

    useEffect(() => {

    const loadData = async () => {
        try {
            const mine = await integrationService.getMyProducts();
            const external = await integrationService.getExternalProducts();

            // NORMALIZAR MIS PRODUCTOS
            const normalizedMine = mine.map(p => ({
                id: p.id,
                name: p.name || "",
                price: Number(p.price) || 0,
                unit: (p.unit || "").toLowerCase(),
                stock: Number(p.stock) || 0
            }));

            // NORMALIZAR PRODUCTOS EXTERNOS
            const normalizedExternal = external.map(p => ({
                id: p.id,
                name: p.name || "",
                price: Number(p.price) || 0,
                unit: (p.unit || "").toLowerCase(),
                stock: Number(p.stock) || 0
            }));

            setMyProducts(normalizedMine);
            setExternalProducts(normalizedExternal);

        } catch (err) {
            console.error("Error integrando:", err);
        } finally {
            setLoading(false);
        }
    };

    loadData();
    }, []);


    // ---- FILTRADO ----
    const filterProducts = (products) => {
        return products.filter((p) => {
            const matchesName = p.name.toLowerCase().includes(search.toLowerCase());
            const matchesUnit = unitFilter ? p.unit.toLowerCase() === unitFilter.toLowerCase() : true;
            const matchesMin = minPrice ? p.price >= Number(minPrice) : true;
            const matchesMax = maxPrice ? p.price <= Number(maxPrice) : true;

            return matchesName && matchesUnit && matchesMin && matchesMax;
        });
    };

    const filteredMyProducts = filterProducts(myProducts);
    const filteredExternalProducts = filterProducts(externalProducts);

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="integration-container">

            {/* Filtros */}
            <div className="filters-bar">
                <input
                    type="text"
                    placeholder="Buscar nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Precio máximo"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />

                <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                >
                    <option value="">Todas las unidades</option>
                    <option value="Unidad">Unidad</option>
                    <option value="Saco">Saco</option>
                    <option value="m3">m³</option>
                    <option value="Galón">Galón</option>
                </select>
            </div>

            {/* ---- TUS PRODUCTOS ---- */}
            <h2>Mis productos</h2>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Unidad</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMyProducts.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.unit}</td>
                            <td>{p.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ---- PRODUCTOS DEL OTRO SISTEMA ---- */}
            <h2>Productos del otro sistema</h2>
            <table className="report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Unidad</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExternalProducts.map((p) => (
                        <tr key={p.id}>
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

export default IntegrationReportPage;