package com.caprisoft.caprisoft.mapper;

import com.caprisoft.caprisoft.dto.ProductCreateDTO;
import com.caprisoft.caprisoft.dto.ProductDTO;
import com.caprisoft.caprisoft.dto.ProductUpdateDTO;
import com.caprisoft.caprisoft.entity.Product;
import com.caprisoft.caprisoft.entity.ProductStatus;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .status(product.getStatus())
                .imageUrl(product.getImageUrl())
                .unit(product.getUnit())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .isActive(product.isActive())
                .build();
    }

    public Product toEntity(ProductCreateDTO dto) {
        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock())
                .category(dto.getCategory())
                .status(dto.getStock() > 0 ? ProductStatus.DISPONIBLE : ProductStatus.AGOTADO)
                .imageUrl(dto.getImageUrl())
                .unit(dto.getUnit())
                .isActive(true)
                .build();
    }

    public void updateEntityFromDTO(Product product, ProductUpdateDTO dto) {
        if (dto.getName() != null) {
            product.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription());
        }
        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }
        if (dto.getStock() != null) {
            product.setStock(dto.getStock());
            // Actualizar estado automáticamente basado en stock
            if (dto.getStock() == 0) {
                product.setStatus(ProductStatus.AGOTADO);
            } else if (product.getStatus() == ProductStatus.AGOTADO) {
                product.setStatus(ProductStatus.DISPONIBLE);
            }
        }
        if (dto.getCategory() != null) {
            product.setCategory(dto.getCategory());
        }
        if (dto.getStatus() != null) {
            product.setStatus(dto.getStatus());
        }
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }
        if (dto.getUnit() != null) {
            product.setUnit(dto.getUnit());
        }
        if (dto.getIsActive() != null) {
            product.setActive(dto.getIsActive());
        }
    }
}