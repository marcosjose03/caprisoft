import React, { useState, useEffect } from 'react';
import { Package, Calendar, CreditCard, Truck, AlertCircle, Loader, X } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import '../styles/Orders.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders(token);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de cancelar este pedido?')) {
      return;
    }

    const reason = window.prompt('Motivo de cancelación (opcional):');

    try {
      setCancellingOrder(orderId);
      await orderService.cancelOrder(orderId, reason, token);
      await loadOrders();
      alert('Pedido cancelado exitosamente');
    } catch (err) {
      alert('Error al cancelar el pedido: ' + err.message);
    } finally {
      setCancellingOrder(null);
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
      month: 'long',
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

  const getStatusLabel = (status) => {
    const labels = {
      PENDIENTE: 'Pendiente',
      CONFIRMADO: 'Confirmado',
      EN_PREPARACION: 'En Preparación',
      ENVIADO: 'Enviado',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado',
    };
    return labels[status] || status;
  };

  const canCancelOrder = (order) => {
    return order.status === 'PENDIENTE' || order.status === 'CONFIRMADO';
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-container">
          <Loader className="spinner" size={48} />
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
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
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Mis Pedidos</h1>
        <p className="orders-subtitle">
          Aquí puedes ver el estado de todos tus pedidos
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <Package size={64} color="#9ca3af" />
          <h2>No tienes pedidos aún</h2>
          <p>Cuando realices un pedido, aparecerá aquí</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-number">
                  <Package size={20} />
                  <span>Pedido #{order.orderNumber}</span>
                </div>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-info-grid">
                  <div className="info-item">
                    <Calendar size={16} />
                    <div>
                      <p className="info-label">Fecha</p>
                      <p className="info-value">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <CreditCard size={16} />
                    <div>
                      <p className="info-label">Método de pago</p>
                      <p className="info-value">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <Truck size={16} />
                    <div>
                      <p className="info-label">Dirección</p>
                      <p className="info-value">{order.deliveryAddress}, {order.deliveryCity}</p>
                    </div>
                  </div>
                </div>

                <div className="order-items-preview">
                  <p className="items-label">Productos ({order.items.length}):</p>
                  <ul>
                    {order.items.slice(0, 3).map((item) => (
                      <li key={item.id}>
                        {item.productName} x{item.quantity}
                      </li>
                    ))}
                    {order.items.length > 3 && (
                      <li className="more-items">
                        +{order.items.length - 3} productos más
                      </li>
                    )}
                  </ul>
                </div>

                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <div className="order-card-footer">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="btn-view-detail"
                >
                  Ver detalle
                </button>

                {canCancelOrder(order) && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrder === order.id}
                    className="btn-cancel-order"
                  >
                    {cancellingOrder === order.id ? 'Cancelando...' : 'Cancelar pedido'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
            <h3>Productos</h3>
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
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;