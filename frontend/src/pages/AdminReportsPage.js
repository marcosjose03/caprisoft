import React, { useState, useEffect } from 'react';
import {
    FileText, BarChart3, Calendar, Download, Loader, AlertCircle,
    TrendingUp, DollarSign, ShoppingCart, Users
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminReports.css';
import {
    BarChart, Bar, PieChart, Pie, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell
} from 'recharts';

const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'];

const AdminReportsPage = () => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Estados para reportes
    const [ordersReport, setOrdersReport] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [productSales, setProductSales] = useState([]);
    const [categorySales, setCategorySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);

    // Filtros de fecha
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [quickFilter, setQuickFilter] = useState('month');

    useEffect(() => {
        // Establecer fechas por defecto (último mes)
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        
        setEndDate(today.toISOString().split('T')[0]);
        setStartDate(lastMonth.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            handleGenerateReport();
        }
    }, [startDate, endDate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleQuickFilter = (filter) => {
        setQuickFilter(filter);
        const today = new Date();
        let start = new Date();

        switch (filter) {
            case 'week':
                start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                break;
            case 'month':
                start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                break;
            case 'quarter':
                start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
                break;
            case 'year':
                start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                break;
            default:
                start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
    };

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setError('Por favor selecciona ambas fechas');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const [orders, stats, products, categories, monthly, customers] = await Promise.all([
                reportService.getOrdersReport(startDate, endDate, token),
                reportService.getStatisticsReport(startDate, endDate, token),
                reportService.getSalesByProduct(startDate, endDate, token),
                reportService.getSalesByCategory(startDate, endDate, token),
                reportService.getSalesByMonth(startDate, endDate, token),
                reportService.getTopCustomers(startDate, endDate, 10, token),
            ]);

            setOrdersReport(orders);
            setStatistics(stats);
            setProductSales(products);
            setCategorySales(categories.data || []);
            setMonthlySales(monthly);
            setTopCustomers(customers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        if (ordersReport.length === 0) return;

        const headers = ['Número de Pedido', 'Cliente', 'Fecha', 'Estado', 'Total', 'Productos', 'Método de Pago'];
        const rows = ordersReport.map(order => [
            order.orderNumber,
            order.customerName,
            formatDate(order.orderDate),
            order.status,
            order.totalAmount,
            order.itemCount,
            order.paymentMethod
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-pedidos-${startDate}-${endDate}.csv`;
        link.click();
    };

    const exportStatisticsToCSV = () => {
        if (productSales.length === 0) return;

        const headers = ['Producto', 'Cantidad Vendida', 'Pedidos', 'Ingresos', 'Participación (%)'];
        const rows = productSales.map(product => [
            product.productName,
            product.totalQuantity,
            product.orderCount,
            product.totalRevenue,
            product.percentageOfTotal
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `estadisticas-productos-${startDate}-${endDate}.csv`;
        link.click();
    };

    return (
        <div className="reports-container">
            <div className="reports-header">
                <div>
                    <h1 className="page-title">Reportes y Estadísticas</h1>
                    <p className="page-subtitle">Análisis detallado de ventas y pedidos</p>
                </div>
            </div>

            {/* Filtros de fecha mejorados */}
            <div className="filters-section">
                {/* Filtros rápidos */}
                <div className="quick-filters">
                    <button
                        onClick={() => handleQuickFilter('week')}
                        className={`quick-filter-btn ${quickFilter === 'week' ? 'active' : ''}`}
                    >
                        Última Semana
                    </button>
                    <button
                        onClick={() => handleQuickFilter('month')}
                        className={`quick-filter-btn ${quickFilter === 'month' ? 'active' : ''}`}
                    >
                        Último Mes
                    </button>
                    <button
                        onClick={() => handleQuickFilter('quarter')}
                        className={`quick-filter-btn ${quickFilter === 'quarter' ? 'active' : ''}`}
                    >
                        Último Trimestre
                    </button>
                    <button
                        onClick={() => handleQuickFilter('year')}
                        className={`quick-filter-btn ${quickFilter === 'year' ? 'active' : ''}`}
                    >
                        Último Año
                    </button>
                </div>

                {/* Filtros personalizados */}
                <div className="date-filters">
                    <div className="filter-group">
                        <label>
                            <Calendar size={18} />
                            Desde
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setQuickFilter('custom');
                            }}
                            className="date-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label>
                            <Calendar size={18} />
                            Hasta
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setQuickFilter('custom');
                            }}
                            className="date-input"
                        />
                    </div>

                    <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className="btn-generate"
                    >
                        {loading ? <Loader className="spinner" size={18} /> : <FileText size={18} />}
                        {loading ? 'Generando...' : 'Actualizar'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {statistics && (
                <>
                    {/* Pestañas */}
                    <div className="report-tabs">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        >
                            <TrendingUp size={18} />
                            Vista General
                        </button>
                        <button
                            onClick={() => setActiveTab('tabular')}
                            className={`tab ${activeTab === 'tabular' ? 'active' : ''}`}
                        >
                            <FileText size={18} />
                            Informe Tabular
                        </button>
                        <button
                            onClick={() => setActiveTab('statistics')}
                            className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
                        >
                            <BarChart3 size={18} />
                            Estadísticas
                        </button>
                        <button
                            onClick={() => setActiveTab('graphics')}
                            className={`tab ${activeTab === 'graphics' ? 'active' : ''}`}
                        >
                            <BarChart3 size={18} />
                            Gráficos
                        </button>
                    </div>

                    {/* Contenido de pestañas */}
                    <div className="report-content">
                        {/* VISTA GENERAL */}
                        {activeTab === 'overview' && (
                            <div className="overview-report">
                                {/* KPIs Principales */}
                                <div className="kpi-grid">
                                    <div className="kpi-card primary">
                                        <div className="kpi-icon">
                                            <DollarSign size={32} />
                                        </div>
                                        <div className="kpi-content">
                                            <p className="kpi-label">Ingresos Totales</p>
                                            <p className="kpi-value">{formatPrice(statistics.totalRevenue)}</p>
                                            <p className="kpi-detail">{statistics.deliveredOrders} pedidos entregados</p>
                                        </div>
                                    </div>

                                    <div className="kpi-card">
                                        <div className="kpi-icon">
                                            <ShoppingCart size={32} />
                                        </div>
                                        <div className="kpi-content">
                                            <p className="kpi-label">Total Pedidos</p>
                                            <p className="kpi-value">{statistics.totalOrders}</p>
                                            <p className="kpi-detail">En el periodo seleccionado</p>
                                        </div>
                                    </div>

                                    <div className="kpi-card">
                                        <div className="kpi-icon">
                                            <TrendingUp size={32} />
                                        </div>
                                        <div className="kpi-content">
                                            <p className="kpi-label">Ticket Promedio</p>
                                            <p className="kpi-value">{formatPrice(statistics.averageOrderValue)}</p>
                                            <p className="kpi-detail">Por pedido</p>
                                        </div>
                                    </div>

                                    <div className="kpi-card">
                                        <div className="kpi-icon">
                                            <Users size={32} />
                                        </div>
                                        <div className="kpi-content">
                                            <p className="kpi-label">Clientes Activos</p>
                                            <p className="kpi-value">{topCustomers.length}</p>
                                            <p className="kpi-detail">Realizaron pedidos</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Gráficos en Vista General */}
                                <div className="overview-charts">
                                    <div className="overview-chart-item">
                                        <h3>Tendencia de Ventas</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={monthlySales}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => formatPrice(value)} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#0d9488"
                                                    strokeWidth={3}
                                                    name="Ingresos"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="overview-chart-item">
                                        <h3>Top 5 Productos</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={productSales.slice(0, 5)}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="productName" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => formatPrice(value)} />
                                                <Bar dataKey="totalRevenue" fill="#0d9488" name="Ingresos" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* INFORME TABULAR */}
                        {activeTab === 'tabular' && (
                            <div className="tabular-report">
                                <div className="report-actions">
                                    <h2>Pedidos del Periodo ({ordersReport.length})</h2>
                                    <button onClick={exportToCSV} className="btn-export">
                                        <Download size={18} />
                                        Exportar CSV
                                    </button>
                                </div>

                                <div className="table-container">
                                    <table className="report-table">
                                        <thead>
                                            <tr>
                                                <th>Pedido</th>
                                                <th>Cliente</th>
                                                <th>Fecha</th>
                                                <th>Estado</th>
                                                <th>Productos</th>
                                                <th>Método Pago</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ordersReport.map((order) => (
                                                <tr key={order.orderNumber}>
                                                    <td className="order-number">{order.orderNumber}</td>
                                                    <td>{order.customerName}</td>
                                                    <td>{formatDate(order.orderDate)}</td>
                                                    <td>{order.status}</td>
                                                    <td>{order.itemCount}</td>
                                                    <td>{order.paymentMethod}</td>
                                                    <td className="total-cell">{formatPrice(order.totalAmount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {ordersReport.length === 0 && (
                                        <div className="no-data-table">
                                            <p>No hay pedidos en el periodo seleccionado</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ESTADÍSTICAS */}
                        {activeTab === 'statistics' && (
                            <div className="statistics-report">
                                <div className="report-actions">
                                    <h2>Estadísticas Detalladas</h2>
                                    <button onClick={exportStatisticsToCSV} className="btn-export">
                                        <Download size={18} />
                                        Exportar Estadísticas
                                    </button>
                                </div>

                                {/* Resumen General */}
                                <div className="stats-summary">
                                    <div className="stat-box">
                                        <h3>Total Pedidos</h3>
                                        <p className="stat-value">{statistics.totalOrders}</p>
                                    </div>
                                    <div className="stat-box">
                                        <h3>Pedidos Entregados</h3>
                                        <p className="stat-value">{statistics.deliveredOrders}</p>
                                    </div>
                                    <div className="stat-box">
                                        <h3>Ingresos Totales</h3>
                                        <p className="stat-value">{formatPrice(statistics.totalRevenue)}</p>
                                    </div>
                                    <div className="stat-box">
                                        <h3>Ticket Promedio</h3>
                                        <p className="stat-value">{formatPrice(statistics.averageOrderValue)}</p>
                                    </div>
                                </div>

                                {/* Ventas por Producto */}
                                <div className="stats-section">
                                    <h2>Ventas por Producto</h2>
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad Vendida</th>
                                                <th>Pedidos</th>
                                                <th>Ingresos</th>
                                                <th>Participación</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productSales.map((product) => (
                                                <tr key={product.productName}>
                                                    <td>{product.productName}</td>
                                                    <td>{product.totalQuantity}</td>
                                                    <td>{product.orderCount}</td>
                                                    <td>{formatPrice(product.totalRevenue)}</td>
                                                    <td>
                                                        <div className="percentage-bar">
                                                            <div
                                                                className="percentage-fill"
                                                                style={{ width: `${product.percentageOfTotal}%` }}
                                                            ></div>
                                                            <span>{product.percentageOfTotal}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Top Clientes */}
                                <div className="stats-section">
                                    <h2>Top 10 Clientes</h2>
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>Posición</th>
                                                <th>Cliente</th>
                                                <th>Pedidos</th>
                                                <th>Total Gastado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topCustomers.map((customer, index) => (
                                                <tr key={index}>
                                                    <td className="rank-cell">#{index + 1}</td>
                                                    <td>{customer.customerName}</td>
                                                    <td>{customer.orderCount}</td>
                                                    <td className="total-cell">{formatPrice(customer.totalSpent)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* GRÁFICOS */}
                        {activeTab === 'graphics' && (
                            <div className="graphics-report">
                                {/* Gráfico de Barras - Ventas por Producto */}
                                <div className="chart-container">
                                    <h2>Ventas por Producto</h2>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={productSales}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="productName" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatPrice(value)} />
                                            <Legend />
                                            <Bar dataKey="totalRevenue" fill="#0d9488" name="Ingresos" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Gráfico Circular - Ventas por Categoría */}
                                <div className="chart-container">
                                    <h2>Distribución de Ventas por Categoría</h2>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={categorySales}
                                                dataKey="revenue"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={120}
                                                label={(entry) => `${entry.category}: ${entry.percentage}%`}
                                            >
                                                {categorySales.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatPrice(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Gráfico de Líneas - Ventas Mensuales */}
                                <div className="chart-container">
                                    <h2>Tendencia de Ventas en el Tiempo</h2>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart data={monthlySales}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatPrice(value)} />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#0d9488"
                                                strokeWidth={2}
                                                name="Ingresos"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {!statistics && !loading && (
                <div className="no-data">
                    <BarChart3 size={64} color="#9ca3af" />
                    <p>Selecciona un periodo para generar reportes</p>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;