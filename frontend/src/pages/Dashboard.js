import React, { useState } from 'react';
import { User, LogOut, ShoppingBag, Package, BarChart3, FileText, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CatalogPage from './CatalogPage';
import CartSidebar from '../components/CartSidebar';
import '../styles/Dashboard.css';
import CheckoutPage from './CheckoutPage';
import MyOrdersPage from './MyOrdersPage';
import AdminDashboardPage from './AdminDashboardPage';
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminReportsPage from './AdminReportsPage';
import ExternalProductsReport from './ExternalProductsReport';
import IntegrationReportPage from './IntegrationReportPage';
import {
  LayoutDashboard,
  GitCompare
} from "lucide-react";


const Dashboard = () => {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();
    const [activeView, setActiveView] = useState('catalog');
    const [cartOpen, setCartOpen] = useState(false);

    const handleCheckout = () => {
        setCartOpen(false);
        setActiveView('checkout');
    };

    const renderContent = () => {
        switch (activeView) {
            case 'catalog':
                return <CatalogPage />;
            case 'checkout':
                return <CheckoutPage />;
            case 'orders':
                return <MyOrdersPage />;
            case 'admin-dashboard':
                return <AdminDashboardPage />;
            case 'products-admin':
                return <AdminProductsPage />;
            case 'orders-admin':
                return <AdminOrdersPage />;
            case 'reports':
                return <AdminReportsPage />;
            case 'integration-report':
                return <IntegrationReportPage />;
            default:
                return <CatalogPage />;
        }
    };

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dashboard-nav">
                <div className="nav-content">
                    <div className="nav-brand">
                        <div className="nav-logo">
                            <span className="logo-emoji">🐐</span>
                        </div>
                        <span className="nav-title">CAPRISOFT</span>
                    </div>

                    <div className="nav-actions">
                        {/* Botón del carrito */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="btn-cart-nav"
                        >
                            <ShoppingCart size={24} />
                            {getTotalItems() > 0 && (
                                <span className="cart-badge-nav">{getTotalItems()}</span>
                            )}
                        </button>

                        {/* Usuario */}
                        <div className="nav-user">
                            <div className="user-info">
                                <User size={20} className="user-icon" />
                                <div className="user-details">
                                    <p className="user-name">{user?.fullName}</p>
                                    <p className="user-role">{user?.role}</p>
                                </div>
                            </div>

                            <button onClick={logout} className="btn-logout">
                                <LogOut size={18} />
                                <span>Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <div className="dashboard-layout">
                <aside className="sidebar">
                    <div className="sidebar-menu">
                        <button
                            onClick={() => setActiveView('catalog')}
                            className={`menu-item ${activeView === 'catalog' ? 'active' : ''}`}
                        >
                            <ShoppingBag size={20} />
                            <span>Catálogo</span>
                        </button>

                        <button
                            onClick={() => setActiveView('orders')}
                            className={`menu-item ${activeView === 'orders' ? 'active' : ''}`}
                        >
                            <FileText size={20} />
                            <span>Mis Pedidos</span>
                        </button>

                        {user?.role === 'ADMIN' && (
                            <>
                                <div className="menu-divider"></div>
                                <p className="menu-label">Administración</p>

                                <button
                                    onClick={() => setActiveView('admin-dashboard')}
                                    className={`menu-item ${activeView === 'admin-dashboard' ? 'active' : ''}`}
                                >
                                    <LayoutDashboard size={20} />
                                    <span>Dashboard</span>
                                </button>

                                <button
                                    onClick={() => setActiveView('products-admin')}
                                    className={`menu-item ${activeView === 'products-admin' ? 'active' : ''}`}
                                >
                                    <Package size={20} />
                                    <span>Productos</span>
                                </button>

                                <button
                                    onClick={() => setActiveView('orders-admin')}
                                    className={`menu-item ${activeView === 'orders-admin' ? 'active' : ''}`}
                                >
                                    <ShoppingCart size={20} />
                                    <span>Pedidos</span>
                                </button>

                                <button
                                    onClick={() => setActiveView('reports')}
                                    className={`menu-item ${activeView === 'reports' ? 'active' : ''}`}
                                >
                                    <BarChart3 size={20} />
                                    <span>Reportes</span>
                                </button>

                                <button
                                    onClick={() => setActiveView('integration-report')}
                                    className={`menu-item ${activeView === 'integration-report' ? 'active' : ''}`}
                                >
                                    <GitCompare size={20} />
                                    <span>Integración</span>
                                </button>
                            </>
                        )}
                    </div>
                </aside>

                {/* Contenido principal */}
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>

            {/* Carrito Sidebar */}
            <CartSidebar
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                onCheckout={handleCheckout}
            />
        </div>
    );
};

export default Dashboard;