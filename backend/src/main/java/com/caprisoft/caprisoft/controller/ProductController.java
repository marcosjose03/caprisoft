package com.caprisoft.caprisoft.controller;

import com.caprisoft.caprisoft.dto.ProductCreateDTO;
import com.caprisoft.caprisoft.dto.ProductDTO;
import com.caprisoft.caprisoft.dto.ProductUpdateDTO;
import com.caprisoft.caprisoft.entity.ProductCategory;
import com.caprisoft.caprisoft.entity.ProductStatus;
import com.caprisoft.caprisoft.exception.InsufficientStockException;
import com.caprisoft.caprisoft.exception.ProductNotFoundException;
import com.caprisoft.caprisoft.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ========== OBTENER TODOS LOS PRODUCTOS (Público) ==========
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            List<ProductDTO> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener productos"));
        }
    }

    // ========== OBTENER PRODUCTO POR ID (Público) ==========
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener el producto"));
        }
    }

    // ========== BUSCAR POR CATEGORÍA (Público) ==========
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getProductsByCategory(@PathVariable ProductCategory category) {
        try {
            List<ProductDTO> products = productService.getProductsByCategory(category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al buscar productos por categoría"));
        }
    }

    // ========== BUSCAR POR ESTADO (Público) ==========
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getProductsByStatus(@PathVariable ProductStatus status) {
        try {
            List<ProductDTO> products = productService.getProductsByStatus(status);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al buscar productos por estado"));
        }
    }

    // ========== BUSCAR POR NOMBRE (Público) ==========
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String name) {
        try {
            List<ProductDTO> products = productService.searchProductsByName(name);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al buscar productos"));
        }
    }

    // ========== CREAR PRODUCTO (Solo ADMIN) ==========
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductCreateDTO createDTO) {
        try {
            ProductDTO product = productService.createProduct(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear el producto: " + e.getMessage()));
        }
    }

    // ========== ACTUALIZAR PRODUCTO (Solo ADMIN) ==========
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO updateDTO) {
        try {
            ProductDTO product = productService.updateProduct(id, updateDTO);
            return ResponseEntity.ok(product);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el producto"));
        }
    }

    // ========== ELIMINAR PRODUCTO (Solo ADMIN) ==========
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado exitosamente"));
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al eliminar el producto"));
        }
    }

    // ========== ACTUALIZAR STOCK (Solo ADMIN) ==========
    @PatchMapping("/{id}/stock/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        try {
            ProductDTO product = productService.updateStock(id, quantity);
            return ResponseEntity.ok(product);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el stock"));
        }
    }

    // ========== REDUCIR STOCK (Solo ADMIN) ==========
    @PatchMapping("/{id}/stock/reduce")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reduceStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        try {
            ProductDTO product = productService.reduceStock(id, quantity);
            return ResponseEntity.ok(product);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (InsufficientStockException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al reducir el stock"));
        }
    }

    // ========== MARCAR COMO AGOTADO (Solo ADMIN) ==========
    @PatchMapping("/{id}/out-of-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsOutOfStock(@PathVariable Long id) {
        try {
            ProductDTO product = productService.markAsOutOfStock(id);
            return ResponseEntity.ok(product);
        } catch (ProductNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el estado"));
        }
    }

    // ========== PRODUCTOS CON STOCK BAJO (Solo ADMIN) ==========
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getLowStockProducts(@RequestParam(defaultValue = "10") Integer threshold) {
        try {
            List<ProductDTO> products = productService.getLowStockProducts(threshold);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener productos con stock bajo"));
        }
    }

    // ========== ESTADÍSTICAS (Solo ADMIN) ==========
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProductStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("availableProducts", productService.countAvailableProducts());
            stats.put("outOfStockProducts", productService.countOutOfStockProducts());
            stats.put("totalProducts", productService.getAllProducts().size());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener estadísticas"));
        }
    }

    // ========== OBTENER CATEGORÍAS DISPONIBLES (Público) ==========
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            Map<String, String> categories = new HashMap<>();
            for (ProductCategory category : ProductCategory.values()) {
                categories.put(category.name(), category.getDisplayName());
            }
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener categorías"));
        }
    }
}