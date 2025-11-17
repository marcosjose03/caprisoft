import React from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
    const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleIncrement = (item) => {
        if (item.quantity < item.stock) {
            updateQuantity(item.id, item.quantity + 1);
        }
    };

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleRemove = (itemId) => {
        if (window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
            removeFromCart(itemId);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

            {/* Sidebar */}
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="cart-header">
                    <div className="cart-title">
                        <ShoppingCart size={24} />
                        <h2>Mi Carrito</h2>
                        {getTotalItems() > 0 && (
                            <span className="cart-badge">{getTotalItems()}</span>
                        )}
                    </div>
                    <button className="btn-close-cart" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <ShoppingCart size={64} color="#9ca3af" />
                            <p>Tu carrito está vacío</p>
                            <button onClick={onClose} className="btn-continue-shopping">
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80?text=Producto';
                                                }}
                                            />
                                        ) : (
                                            <div className="cart-item-placeholder">📦</div>
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <h4 className="cart-item-name">{item.name}</h4>
                                        <p className="cart-item-price">
                                            {formatPrice(item.price)} / {item.unit}
                                        </p>

                                        <div className="cart-item-controls">
                                            <div className="quantity-controls-mini">
                                                <button
                                                    onClick={() => handleDecrement(item)}
                                                    disabled={item.quantity <= 1}
                                                    className="btn-qty-mini"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="qty-display">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrement(item)}
                                                    disabled={item.quantity >= item.stock}
                                                    className="btn-qty-mini"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="btn-remove-item"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <p className="cart-item-subtotal">
                                            Subtotal: {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span className="total-amount">{formatPrice(getTotalPrice())}</span>
                        </div>
                        <button onClick={onCheckout} className="btn-checkout">
                            Proceder al Pago
                        </button>
                        <button onClick={onClose} className="btn-continue">
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;