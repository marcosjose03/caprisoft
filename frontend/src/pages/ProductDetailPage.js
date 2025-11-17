import React, { useState, useEffect } from 'react';
import { ChevronLeft, ShoppingCart, AlertCircle, Loader, Plus, Minus } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import '../styles/ProductDetail.css';

const ProductDetailPage = ({ productId, onBack }) => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        loadProduct();
    }, [productId]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getProductById(productId);
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const isAvailable = product?.status === 'DISPONIBLE' && product?.stock > 0;

    if (loading) {
        return (
            <div className="product-detail-container">
                <div className="loading-container">
                    <Loader className="spinner" size={48} />
                    <p>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-container">
                <div className="error-container">
                    <AlertCircle size={48} color="#991b1b" />
                    <p>{error || 'Producto no encontrado'}</p>
                    <button onClick={onBack} className="btn-back">
                        Volver al catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            {/* Botón volver */}
            <button onClick={onBack} className="btn-back-detail">
                <ChevronLeft size={20} />
                Volver
            </button>

            <div className="product-detail-content">
                {/* Imagen */}
                <div className="product-detail-image">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500x400?text=Producto';
                            }}
                        />
                    ) : (
                        <div className="image-placeholder">📦</div>
                    )}

                    {/* Badge */}
                    <div className={`product-detail-badge ${product.status === 'AGOTADO' ? 'badge-out' : 'badge-available'}`}>
                        {product.status === 'DISPONIBLE' ? 'Disponible' : 'Agotado'}
                    </div>
                </div>

                {/* Información */}
                <div className="product-detail-info">
                    <div className="product-detail-header">
                        <h1 className="product-detail-name">{product.name}</h1>
                        <div className="product-detail-category">
                            {product.category}
                        </div>
                    </div>

                    <p className="product-detail-description">
                        {product.description}
                    </p>

                    <div className="product-detail-specs">
                        <div className="spec">
                            <span className="spec-label">Precio:</span>
                            <span className="spec-value price">
                                {formatPrice(product.price)} / {product.unit}
                            </span>
                        </div>
                        <div className="spec">
                            <span className="spec-label">Stock disponible:</span>
                            <span className="spec-value">
                                {product.stock} {product.unit}
                            </span>
                        </div>
                        <div className="spec">
                            <span className="spec-label">Unidad de medida:</span>
                            <span className="spec-value">{product.unit}</span>
                        </div>
                        <div className="spec">
                            <span className="spec-label">Estado:</span>
                            <span className={`spec-value ${product.status === 'DISPONIBLE' ? 'status-available' : 'status-out'}`}>
                                {product.status === 'DISPONIBLE' ? 'Disponible' : 'Agotado'}
                            </span>
                        </div>
                    </div>

                    {/* Selector de cantidad y carrito */}
                    {isAvailable ? (
                        <div className="product-detail-actions">
                            <div className="quantity-selector">
                                <label>Cantidad:</label>
                                <div className="quantity-controls">
                                    <button
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1}
                                        className="btn-quantity"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            if (val > 0 && val <= product.stock) {
                                                setQuantity(val);
                                            }
                                        }}
                                        className="quantity-input"
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button
                                        onClick={incrementQuantity}
                                        disabled={quantity >= product.stock}
                                        className="btn-quantity"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn-add-to-cart-detail"
                            >
                                <ShoppingCart size={20} />
                                Agregar al carrito
                            </button>
                        </div>
                    ) : (
                        <div className="out-of-stock-message">
                            <AlertCircle size={20} />
                            <p>Producto no disponible en este momento</p>
                        </div>
                    )}

                    {/* Mensaje de confirmación */}
                    {addedToCart && (
                        <div className="success-message">
                            ✓ Agregado al carrito correctamente
                        </div>
                    )}

                    {/* Información adicional */}
                    <div className="product-detail-footer">
                        <div className="info-box">
                            <h3>Entrega</h3>
                            <p>Disponible para retiro o envío a domicilio</p>
                        </div>
                        <div className="info-box">
                            <h3>Garantía</h3>
                            <p>Productos frescos garantizados</p>
                        </div>
                        <div className="info-box">
                            <h3>Soporte</h3>
                            <p>Contactanos para más información</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;