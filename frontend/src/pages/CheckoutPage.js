import React, { useState } from 'react';
import { CreditCard, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import '../styles/Checkout.css';

const CheckoutPage = () => {
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const { user, token } = useAuth();

    const [formData, setFormData] = useState({
        deliveryName: user?.fullName || '',
        deliveryPhone: '',
        deliveryAddress: '',
        deliveryCity: '',
        notes: '',
        paymentMethod: 'CASH',
    });

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validaciones
        if (!formData.deliveryPhone || !formData.deliveryAddress || !formData.deliveryCity) {
            setError('Por favor completa todos los campos requeridos');
            setLoading(false);
            return;
        }

        try {
            // Preparar datos del pedido
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
                paymentMethod: formData.paymentMethod,
                deliveryName: formData.deliveryName,
                deliveryPhone: formData.deliveryPhone,
                deliveryAddress: formData.deliveryAddress,
                deliveryCity: formData.deliveryCity,
                notes: formData.notes,
            };

            // Crear pedido
            const order = await orderService.createOrder(orderData, token);

            setOrderNumber(order.orderNumber);
            setOrderPlaced(true);
            clearCart();
        } catch (err) {
            setError(err.message || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="checkout-container">
                <div className="empty-cart-message">
                    <AlertCircle size={64} color="#9ca3af" />
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega productos al carrito para continuar</p>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="checkout-container">
                <div className="order-success">
                    <CheckCircle size={80} color="#10b981" />
                    <h2>¡Pedido realizado exitosamente!</h2>
                    <p>Tu pedido ha sido procesado correctamente</p>
                    <div className="success-details">
                        <p><strong>Número de pedido:</strong> {orderNumber}</p>
                        <p><strong>Total pagado:</strong> {formatPrice(getTotalPrice())}</p>
                        <p><strong>Estado:</strong> Pendiente</p>
                    </div>
                    <p className="success-note">
                        Recibirás una confirmación y podrás seguir tu pedido en la sección "Mis Pedidos"
                    </p>
                    <button
                        onClick={() => window.location.href = '/orders'}
                        className="btn-view-orders"
                    >
                        Ver mis pedidos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Finalizar Compra</h1>

            <div className="checkout-grid">
                {/* Formulario */}
                <div className="checkout-form-section">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        {/* Información de entrega */}
                        <div className="form-section">
                            <div className="section-header">
                                <Truck size={24} />
                                <h3>Información de Entrega</h3>
                            </div>

                            <div className="form-group">
                                <label>Nombre completo *</label>
                                <input
                                    type="text"
                                    name="deliveryName"
                                    value={formData.deliveryName}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Teléfono *</label>
                                <input
                                    type="tel"
                                    name="deliveryPhone"
                                    value={formData.deliveryPhone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+57 300 123 4567"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Dirección *</label>
                                <input
                                    type="text"
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    required
                                    placeholder="Calle 123 #45-67"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Ciudad *</label>
                                <input
                                    type="text"
                                    name="deliveryCity"
                                    value={formData.deliveryCity}
                                    onChange={handleChange}
                                    required
                                    placeholder="Bucaramanga"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Notas adicionales (opcional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Instrucciones especiales para la entrega..."
                                    className="form-input"
                                ></textarea>
                            </div>
                        </div>

                        {/* Método de pago */}
                        <div className="form-section">
                            <div className="section-header">
                                <CreditCard size={24} />
                                <h3>Método de Pago</h3>
                            </div>

                            <div className="payment-methods">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CASH"
                                        checked={formData.paymentMethod === 'CASH'}
                                        onChange={handleChange}
                                    />
                                    <span>💵 Pago en efectivo</span>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="TRANSFER"
                                        checked={formData.paymentMethod === 'TRANSFER'}
                                        onChange={handleChange}
                                    />
                                    <span>🏦 Transferencia bancaria</span>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CARD"
                                        checked={formData.paymentMethod === 'CARD'}
                                        onChange={handleChange}
                                    />
                                    <span>💳 Tarjeta de crédito/débito</span>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-place-order"
                        >
                            {loading ? 'Procesando...' : `Realizar Pedido - ${formatPrice(getTotalPrice())}`}
                        </button>
                    </form>
                </div>

                {/* Resumen del pedido */}
                <div className="order-summary">
                    <h3>Resumen del Pedido</h3>

                    <div className="summary-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="summary-item">
                                <div className="summary-item-info">
                                    <p className="summary-item-name">{item.name}</p>
                                    <p className="summary-item-qty">
                                        {item.quantity} x {formatPrice(item.price)}
                                    </p>
                                </div>
                                <p className="summary-item-total">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                        <div className="summary-row">
                            <span>Envío</span>
                            <span className="text-green">Gratis</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;