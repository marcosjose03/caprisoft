package com.caprisoft.caprisoft.controller;

import com.caprisoft.caprisoft.entity.Product;
import com.caprisoft.caprisoft.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integration")
@RequiredArgsConstructor
public class IntegrationController {

    private final ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<?> exportProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }
}
