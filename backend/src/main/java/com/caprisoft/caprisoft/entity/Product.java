package com.caprisoft.caprisoft.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    private String imageUrl;

    @Column(nullable = false)
    private String unit; // kg, litro, unidad, etc.

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private boolean isActive = true;

    // Método helper para verificar si hay stock disponible
    public boolean hasStock(Integer quantity) {
        return this.stock >= quantity && this.status == ProductStatus.DISPONIBLE;
    }

    // Método para reducir stock
    public void reduceStock(Integer quantity) {
        if (!hasStock(quantity)) {
            throw new IllegalStateException("Stock insuficiente");
        }
        this.stock -= quantity;
        if (this.stock == 0) {
            this.status = ProductStatus.AGOTADO;
        }
    }

    // Método para aumentar stock
    public void addStock(Integer quantity) {
        this.stock += quantity;
        if (this.stock > 0 && this.status == ProductStatus.AGOTADO) {
            this.status = ProductStatus.DISPONIBLE;
        }
    }
}