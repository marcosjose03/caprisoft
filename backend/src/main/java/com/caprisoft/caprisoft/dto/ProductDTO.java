package com.caprisoft.caprisoft.dto;

import com.caprisoft.caprisoft.entity.ProductCategory;
import com.caprisoft.caprisoft.entity.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private ProductCategory category;
    private ProductStatus status;
    private String imageUrl;
    private String unit;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
}