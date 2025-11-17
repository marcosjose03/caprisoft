import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Edit, Trash2, Package, AlertCircle,
    Loader, X, Save
} from 'lucide-react';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminProducts.css';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, selectedCategory]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error cargando categorías:', err);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    const handleCreate = () => {
        setEditingProduct({
            name: '',
            description: '',
            price: '',
            stock: '',
            category: 'LECHE',
            unit: 'litro',
            imageUrl: ''
        });
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct({ ...product });
        setShowModal(true);
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
            return;
        }

        try {
            await productService.deleteProduct(product.id, token);
            alert('Producto eliminado exitosamente');
            loadProducts();
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            if (editingProduct.id) {
                // Actualizar
                await productService.updateProduct(editingProduct.id, editingProduct, token);
                alert('Producto actualizado exitosamente');
            } else {
                // Crear
                await productService.createProduct(editingProduct, token);
                alert('Producto creado exitosamente');
            }
            setShowModal(false);
            loadProducts();
        } catch (err) {
            alert('Error al guardar: ' + err.message);
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
            <div className="admin-products-container">
                <div className="loading-container">
                    <Loader className="spinner" size={48} />
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-products-container">
            <div className="admin-products-header">
                <div>
                    <h1 className="page-title">Gestión de Productos</h1>
                    <p className="page-subtitle">Administra el catálogo de productos</p>
                </div>
                <button onClick={handleCreate} className="btn-create">
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            {/* Filtros */}
            <div className="products-filters">
                <div className="filter-search">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                >
                    <option value="ALL">Todas las categorías</option>
                    {Object.entries(categories).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Tabla de productos */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-cell">
                                        <div className="product-image-small">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} />
                                            ) : (
                                                <Package size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="product-name-cell">{product.name}</p>
                                            <p className="product-description-cell">{product.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="category-badge">{product.category}</span>
                                </td>
                                <td className="price-cell">
                                    {formatPrice(product.price)}
                                    <span className="unit-cell">/ {product.unit}</span>
                                </td>
                                <td>
                                    <span className={`stock-badge ${product.stock < 10 ? 'stock-low' : 'stock-ok'}`}>
                                        {product.stock} {product.unit}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${product.status === 'DISPONIBLE' ? 'status-available' : 'status-out'}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="btn-action btn-edit"
                                            title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="btn-action btn-delete"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="no-results">
                        <AlertCircle size={48} />
                        <p>No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Modal de crear/editar */}
            {showModal && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                    onChange={setEditingProduct}
                />
            )}
        </div>
    );
};

// Modal de crear/editar producto
const ProductModal = ({ product, categories, onSave, onClose, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({
            ...product,
            [name]: value
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button onClick={onClose} className="btn-close-modal">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSave} className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre *</label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoría *</label>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                required
                                className="form-input"
                            >
                                {Object.entries(categories).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Precio *</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock *</label>
                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Unidad *</label>
                            <select
                                name="unit"
                                value={product.unit}
                                onChange={handleChange}
                                required
                                className="form-input"
                            >
                                <option value="litro">Litro</option>
                                <option value="kg">Kilogramo</option>
                                <option value="unidad">Unidad</option>
                                <option value="gramo">Gramo</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>URL de Imagen</label>
                            <input
                                type="url"
                                name="imageUrl"
                                value={product.imageUrl || ''}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Descripción *</label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save">
                            <Save size={18} />
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProductsPage;