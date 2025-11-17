import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, DollarSign, Users, 
  TrendingUp, AlertCircle, CheckCircle, XCircle, Clock,
  Loader
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import '../styles/Admin.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStats(token);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-container">
          <Loader className="spinner" size={48} />
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-container">
          <AlertCircle size={48} color="#991b1b" />
          <p>{error}</p>
          <button onClick={loadStats} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Resumen general del sistema</p>
      </div>

      {/* Sección de Productos */}
      <section className="stats-section">
        <h2 className="section-title">
          <Package size={24} />
          Productos
        </h2>
        <div className="stats-grid">
          <StatCard
            icon={Package}
            title="Total Productos"
            value={stats.totalProducts}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Disponibles"
            value={stats.availableProducts}
            color="green"
          />
          <StatCard
            icon={XCircle}
            title="Agotados"
            value={stats.outOfStockProducts}
            color="red"
          />
          <StatCard
            icon={AlertCircle}
            title="Stock Bajo"
            value={stats.lowStockProducts}
            subtitle="Menos de 10 unidades"
            color="yellow"
          />
        </div>
      </section>

      {/* Sección de Pedidos */}
      <section className="stats-section">
        <h2 className="section-title">
          <ShoppingCart size={24} />
          Pedidos
        </h2>
        <div className="stats-grid">
          <StatCard
            icon={ShoppingCart}
            title="Total Pedidos"
            value={stats.totalOrders}
            color="blue"
          />
          <StatCard
            icon={Clock}
            title="Pendientes"
            value={stats.pendingOrders}
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            title="Confirmados"
            value={stats.confirmedOrders}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Entregados"
            value={stats.deliveredOrders}
            color="green"
          />
          <StatCard
            icon={XCircle}
            title="Cancelados"
            value={stats.cancelledOrders}
            color="red"
          />
        </div>
      </section>

      {/* Sección de Ingresos */}
      <section className="stats-section">
        <h2 className="section-title">
          <DollarSign size={24} />
          Ingresos
        </h2>
        <div className="stats-grid revenue-grid">
          <div className="revenue-card total">
            <div className="revenue-header">
              <DollarSign size={32} />
              <span className="revenue-label">Ingresos Totales</span>
            </div>
            <p className="revenue-amount">{formatPrice(stats.totalRevenue)}</p>
            <p className="revenue-subtitle">Pedidos entregados</p>
          </div>
          <div className="revenue-card monthly">
            <div className="revenue-header">
              <TrendingUp size={32} />
              <span className="revenue-label">Ingresos del Mes</span>
            </div>
            <p className="revenue-amount">{formatPrice(stats.monthlyRevenue)}</p>
            <p className="revenue-subtitle">Mes actual</p>
          </div>
        </div>
      </section>

      {/* Sección de Usuarios */}
      <section className="stats-section">
        <h2 className="section-title">
          <Users size={24} />
          Usuarios
        </h2>
        <div className="stats-grid">
          <StatCard
            icon={Users}
            title="Total Usuarios"
            value={stats.totalUsers}
            color="purple"
          />
          <StatCard
            icon={CheckCircle}
            title="Usuarios Activos"
            value={stats.activeUsers}
            color="green"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;