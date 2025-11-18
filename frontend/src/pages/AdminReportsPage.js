import React, { useState } from 'react';
import axios from 'axios';
import "../styles/AdminReports.css";


const AdminReportsPage = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const fetchStatistics = async () => {
        if (!startDate || !endDate) {
            alert("Selecciona ambas fechas");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(
                "http://localhost:8080/api/reports/statistics",
                {
                    params: { startDate, endDate },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReportData(response.data);
        } catch (error) {
            console.error("Error consumiendo reportes:", error);
            alert("Error cargando el reporte");
        }

        setLoading(false);
    };

    return (
        <div className="reports-page">
            <h1 className="title">📊 Reportes Administrativos</h1>

            {/* Filtros */}
            <div className="filters">
                <label>
                    Fecha Inicio:
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                </label>

                <label>
                    Fecha Fin:
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </label>

                <button onClick={fetchStatistics} className="btn-generate">
                    Generar Reporte
                </button>
            </div>

            {/* Datos del reporte */}
            {loading && <p>Cargando...</p>}

            {reportData && (
                <div className="report-card">
                    <h2>Resultados</h2>
                    <p><strong>Total de órdenes:</strong> {reportData.totalOrders}</p>
                    <p><strong>Total vendido:</strong> ${reportData.totalRevenue}</p>
                    <p><strong>Promedio por orden:</strong> ${reportData.averageOrderValue}</p>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;
