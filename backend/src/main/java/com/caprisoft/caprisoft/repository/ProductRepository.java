package com.caprisoft.caprisoft.repository;

import com.caprisoft.caprisoft.entity.Product;
import com.caprisoft.caprisoft.entity.ProductCategory;
import com.caprisoft.caprisoft.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Buscar productos activos
    List<Product> findByIsActiveTrue();
    
    // Buscar por categoría
    List<Product> findByCategoryAndIsActiveTrue(ProductCategory category);
    
    // Buscar por estado
    List<Product> findByStatusAndIsActiveTrue(ProductStatus status);
    
    // Buscar por nombre (búsqueda parcial)
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    // Buscar por ID y activo
    Optional<Product> findByIdAndIsActiveTrue(Long id);
    
    // Buscar productos con stock bajo
    @Query("SELECT p FROM Product p WHERE p.stock <= :threshold AND p.isActive = true")
    List<Product> findLowStockProducts(Integer threshold);
    
    // Contar productos por estado
    Long countByStatusAndIsActiveTrue(ProductStatus status);
}