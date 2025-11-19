import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertCircle, Loader, Package } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import '../styles/Catalog.css';
import ProductDetailPage from './ProductDetailPage';

const CatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    // PRODUCTO SELECCIONADO PARA EL DETALLE
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
    };

    // Cargar productos y categorías al iniciar
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // Aplicar filtros cuando cambian
    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, selectedCategory, selectedStatus]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
            setFilteredProducts(data);
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

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por categoría
        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Filtrar por estado
        if (selectedStatus !== 'ALL') {
            filtered = filtered.filter(product => product.status === selectedStatus);
        }

        setFilteredProducts(filtered);
    };

    const handleAddToCart = (product) => {
        console.log('Agregar al carrito:', product);
        alert(`${product.name} agregado al carrito`);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('ALL');
        setSelectedStatus('ALL');
    };

    // ⬇️⬇️⬇️ VISTA DE DETALLE DEL PRODUCTO
    if (selectedProduct) {
        return (
            <ProductDetailPage
                productId={selectedProduct.id}
                onBack={() => setSelectedProduct(null)}
            />
        );
    }
    // ⬆️⬆️⬆️ FIN DE VISTA DE DETALLE

    if (loading) {
        return (
            <div className="catalog-container">
                <div className="loading-container">
                    <Loader className="spinner" size={48} />
                    <p>Cargando productos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalog-container">
                <div className="error-container">
                    <AlertCircle size={48} color="#991b1b" />
                    <p>{error}</p>
                    <button onClick={loadProducts} className="btn-retry">
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="catalog-container">
            {/* Header */}
            <div className="catalog-header">
                <h1 className="catalog-title">Catálogo de Productos</h1>
                <p className="catalog-subtitle">
                    Explora nuestra selección de productos caprinos de alta calidad
                </p>
            </div>

            {/* Filtros */}
        <div className="catalog-filters">

            {/* Buscar */}
            <div className="filter-box">
                <Search size={18} className="filter-icon-left" />
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Categorías */}
            <div className="filter-box">
                <Filter size={18} className="filter-icon-left" />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="ALL">Todas las categorías</option>
                    {Object.entries(categories).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>

            {/* Estado */}
            <div className="filter-box">
                <Filter size={18} className="filter-icon-left" />
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="ALL">Todos los estados</option>
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="AGOTADO">Agotado</option>
                </select>
            </div>

            {/* Botón limpiar */}
            {(searchTerm || selectedCategory !== "ALL" || selectedStatus !== "ALL") && (
                <button onClick={clearFilters} className="btn-clear-filters">
                    Limpiar filtros
                </button>
            )}
        </div>


            {/* Resultados */}
            <div className="catalog-results">
                <p className="results-count">
                    {filteredProducts.length}{' '}
                    {filteredProducts.length === 1
                        ? 'producto encontrado'
                        : 'productos encontrados'}
                </p>
            </div>

            {/* Grid de productos */}
            {filteredProducts.length > 0 ? (
                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onViewDetails={handleViewDetails}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-products">
                    <Package size={64} color="#9ca3af" />
                    <p>No se encontraron productos</p>
                    <button onClick={clearFilters} className="btn-clear-filters">
                        Limpiar filtros
                    </button>
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
