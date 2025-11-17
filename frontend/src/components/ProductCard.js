import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import '../styles/Catalog.css';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onViewDetails }) => {
    const { addToCart } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const isAvailable = product.status === 'DISPONIBLE' && product.stock > 0;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <div className="product-card" onClick={() => onViewDetails(product)}>
            {/* Imagen */}
            <div className="product-image-container">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Producto';
                        }}
                    />
                ) : (
                    <div className="product-placeholder">
                        <Package size={48} />
                    </div>
                )}

                {/* Badge de estado */}
                <div className={`product-badge ${product.status === 'AGOTADO' ? 'badge-out' : 'badge-available'}`}>
                    {product.status === 'DISPONIBLE' ? 'Disponible' : 'Agotado'}
                </div>
            </div>

            {/* Información */}
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-details">
                    <div className="product-category">
                        {product.category}
                    </div>
                    <div className="product-stock">
                        Stock: {product.stock} {product.unit}
                    </div>
                </div>

                <div className="product-footer">
                    <div className="product-price">
                        {formatPrice(product.price)}
                        <span className="product-unit">/ {product.unit}</span>
                    </div>

                    <div className="product-actions">
                        <button
                            className="btn-view-details"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(product);
                            }}
                        >
                            Ver detalles
                        </button>

                        {isAvailable && (
                            <button
                                onClick={handleAddToCart}
                                className="btn-add-cart"
                                title="Agregar al carrito"
                            >
                                <ShoppingCart size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;