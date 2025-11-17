import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Package, Calendar, User, Loader,
    AlertCircle, Eye, RefreshCw, X
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminOrders.css';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statuses, setStatuses] = useState({});
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        loadOrders();
        loadStatuses();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [orders, selectedStatus, searchTerm]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders(token);
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadStatuses = async () => {
        try {
            const data = await orderService.getStatuses();
            setStatuses(data);
        } catch (err) {
            console.error('Error cargando estados:', err);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedStatus !== 'ALL') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        setFilteredOrders(filtered);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`¿Cambiar el estado del pedido a "${statuses[newStatus]}"?`)) {
            return;
        }

        try {
            setUpdatingOrder(orderId);
            await orderService.updateOrderStatus(orderId, newStatus, token);
            alert('Estado actualizado exitosamente');
            loadOrders();
        } catch (err) {
            alert('Error al actualizar: ' + err.message);
        } finally {
            setUpdatingOrder(null);
        }
    };

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
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDIENTE: 'status-pending',
            CONFIRMADO: 'status-confirmed',
            EN_PREPARACION: 'status-preparing',
            ENVIADO: 'status-shipped',
            ENTREGADO: 'status-delivered',
            CANCELADO: 'status-cancelled',
        };
        return colors[status] || 'status-default';
    };

    if (loading) {
        return (
            <div className="admin-orders-container">
                <div className="loading-container">
                    <Loader className="spinner" size={48} />
                    <p>Cargando pedidos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-orders-container">
                <div className="error-container">
                    <AlertCircle size={48} color="#991b1b" />
                    <p>{error}</p>
                    <button onClick={loadOrders} className="btn-retry">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders-container">
            <div className="admin-orders-header">
                <div>
                    <h1 className="page-title">Gestión de Pedidos</h1>
                    <p className="page-subtitle">Administra todos los pedidos del sistema</p>
                </div>
                <button onClick={loadOrders} className="btn-refresh">
                    <RefreshCw size={20} />
                    Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div className="orders-filters">
                <div className="filter-search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por número o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="ALL">Todos los estados</option>
                    {Object.entries(statuses).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Estadísticas rápidas */}
            <div className="quick-stats">
                <div className="quick-stat">
                    <span className="stat-label">Total</span>
                    <span className="stat-number">{filteredOrders.length}</span>
                </div>
                <div className="quick-stat stat-pending">
                    <span className="stat-label">Pendientes</span>
                    <span className="stat-number">
                        {filteredOrders.filter(o => o.status === 'PENDIENTE').length}
                    </span>
                </div>
                <div className="quick-stat stat-confirmed">
                    <span className="stat-label">Confirmados</span>
                    <span className="stat-number">
                        {filteredOrders.filter(o => o.status === 'CONFIRMADO').length}
                    </span>
                </div>
                <div className="quick-stat stat-delivered">
                    <span className="stat-label">Entregados</span>
                    <span className="stat-number">
                        {filteredOrders.filter(o => o.status === 'ENTREGADO').length}
                    </span>
                </div>
            </div>

            {/* Tabla de pedidos */}
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <div className="order-number-cell">
                                        <Package size={20} />
                                        <span>#{order.orderNumber}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="customer-cell">
                                        <User size={16} />
                                        <div>
                                            <p className="customer-name">{order.userName}</p>
                                            <p className="customer-phone">{order.deliveryPhone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-cell">
                                        <Calendar size={16} />
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                </td>
                                <td className="total-cell">
                                    {formatPrice(order.totalAmount)}
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                        disabled={updatingOrder === order.id}
                                        className={`status-select ${getStatusColor(order.status)}`}
                                    >
                                        {Object.entries(statuses).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="btn-action btn-view"
                                        title="Ver detalle"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="no-results">
                        <AlertCircle size={48} />
                        <p>No se encontraron pedidos</p>
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

// Modal de detalle del pedido
const OrderDetailModal = ({ order, onClose }) => {
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Detalle del Pedido #{order.orderNumber}</h2>
                    <button onClick={onClose} className="btn-close-modal">
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Información del cliente */}
                    <div className="detail-section">
                        <h3>Información del Cliente</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Nombre:</span>
                                <span className="detail-value">{order.userName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">Usuario ID: {order.userId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información del pedido */}
                    <div className="detail-section">
                        <h3>Información del Pedido</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Estado:</span>
                                <span className="detail-value">{order.status}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Fecha:</span>
                                <span className="detail-value">{formatDate(order.createdAt)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Método de pago:</span>
                                <span className="detail-value">{order.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información de entrega */}
                    <div className="detail-section">
                        <h3>Información de Entrega</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Nombre:</span>
                                <span className="detail-value">{order.deliveryName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Teléfono:</span>
                                <span className="detail-value">{order.deliveryPhone}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Dirección:</span>
                                <span className="detail-value">{order.deliveryAddress}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Ciudad:</span>
                                <span className="detail-value">{order.deliveryCity}</span>
                            </div>
                        </div>
                        {order.notes && (
                            <div className="detail-notes">
                                <span className="detail-label">Notas:</span>
                                <p>{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Productos */}
                    <div className="detail-section">
                        <h3>Productos ({order.items.length})</h3>
                        <div className="detail-items">
                            {order.items.map((item) => (
                                <div key={item.id} className="detail-product">
                                    <div className="detail-product-info">
                                        <p className="detail-product-name">{item.productName}</p>
                                        <p className="detail-product-price">
                                            {formatPrice(item.unitPrice)} x {item.quantity} {item.unit}
                                        </p>
                                    </div>
                                    <p className="detail-product-total">
                                        {formatPrice(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="detail-total">
                        <span>Total del Pedido:</span>
                        <span className="detail-total-amount">{formatPrice(order.totalAmount)}</span>
                    </div>

                    {/* Fechas adicionales */}
                    {(order.deliveredAt || order.cancelledAt) && (
                        <div className="detail-section">
                            <h3>Información Adicional</h3>
                            <div className="detail-grid">
                                {order.deliveredAt && (
                                    <div className="detail-item">
                                        <span className="detail-label">Entregado:</span>
                                        <span className="detail-value">{formatDate(order.deliveredAt)}</span>
                                    </div>
                                )}
                                {order.cancelledAt && (
                                    <div className="detail-item">
                                        <span className="detail-label">Cancelado:</span>
                                        <span className="detail-value">{formatDate(order.cancelledAt)}</span>
                                    </div>
                                )}
                                {order.cancellationReason && (
                                    <div className="detail-item full-width">
                                        <span className="detail-label">Razón de cancelación:</span>
                                        <span className="detail-value">{order.cancellationReason}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;