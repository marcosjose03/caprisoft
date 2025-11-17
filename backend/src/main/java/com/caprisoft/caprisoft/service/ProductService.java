package com.caprisoft.caprisoft.service;

import com.caprisoft.caprisoft.dto.ProductCreateDTO;
import com.caprisoft.caprisoft.dto.ProductDTO;
import com.caprisoft.caprisoft.dto.ProductUpdateDTO;
import com.caprisoft.caprisoft.entity.Product;
import com.caprisoft.caprisoft.entity.ProductCategory;
import com.caprisoft.caprisoft.entity.ProductStatus;
import com.caprisoft.caprisoft.exception.InsufficientStockException;
import com.caprisoft.caprisoft.exception.ProductNotFoundException;
import com.caprisoft.caprisoft.mapper.ProductMapper;
import com.caprisoft.caprisoft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    // ========== CREAR PRODUCTO ==========
    @Transactional
    public ProductDTO createProduct(ProductCreateDTO createDTO) {
        Product product = productMapper.toEntity(createDTO);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }

    // ========== OBTENER TODOS LOS PRODUCTOS ==========
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== OBTENER PRODUCTO POR ID ==========
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return productMapper.toDTO(product);
    }

    // ========== BUSCAR PRODUCTOS POR CATEGORÍA ==========
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategoryAndIsActiveTrue(category)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== BUSCAR PRODUCTOS POR ESTADO ==========
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByStatus(ProductStatus status) {
        return productRepository.findByStatusAndIsActiveTrue(status)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== BUSCAR PRODUCTOS POR NOMBRE ==========
    @Transactional(readOnly = true)
    public List<ProductDTO> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== ACTUALIZAR PRODUCTO ==========
    @Transactional
    public ProductDTO updateProduct(Long id, ProductUpdateDTO updateDTO) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        productMapper.updateEntityFromDTO(product, updateDTO);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toDTO(updatedProduct);
    }

    // ========== ELIMINAR PRODUCTO (Soft Delete) ==========
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        product.setActive(false);
        productRepository.save(product);
    }

    // ========== ACTUALIZAR STOCK ==========
    @Transactional
    public ProductDTO updateStock(Long id, Integer quantity) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        product.addStock(quantity);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toDTO(updatedProduct);
    }

    // ========== REDUCIR STOCK ==========
    @Transactional
    public ProductDTO reduceStock(Long id, Integer quantity) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        if (!product.hasStock(quantity)) {
            throw new InsufficientStockException(id, quantity, product.getStock());
        }
        
        product.reduceStock(quantity);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toDTO(updatedProduct);
    }

    // ========== MARCAR COMO AGOTADO ==========
    @Transactional
    public ProductDTO markAsOutOfStock(Long id) {
        Product product = productRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        
        product.setStatus(ProductStatus.AGOTADO);
        Product updatedProduct = productRepository.save(product);
        return productMapper.toDTO(updatedProduct);
    }

    // ========== OBTENER PRODUCTOS CON STOCK BAJO ==========
    @Transactional(readOnly = true)
    public List<ProductDTO> getLowStockProducts(Integer threshold) {
        return productRepository.findLowStockProducts(threshold)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== ESTADÍSTICAS ==========
    @Transactional(readOnly = true)
    public Long countAvailableProducts() {
        return productRepository.countByStatusAndIsActiveTrue(ProductStatus.DISPONIBLE);
    }

    @Transactional(readOnly = true)
    public Long countOutOfStockProducts() {
        return productRepository.countByStatusAndIsActiveTrue(ProductStatus.AGOTADO);
    }
}