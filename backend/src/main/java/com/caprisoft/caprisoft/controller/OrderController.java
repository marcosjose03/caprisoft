package com.caprisoft.caprisoft.controller;

import com.caprisoft.caprisoft.dto.OrderCreateDTO;
import com.caprisoft.caprisoft.dto.OrderDTO;
import com.caprisoft.caprisoft.entity.OrderStatus;
import com.caprisoft.caprisoft.exception.InsufficientStockException;
import com.caprisoft.caprisoft.exception.OrderNotCancellableException;
import com.caprisoft.caprisoft.exception.OrderNotFoundException;
import com.caprisoft.caprisoft.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ========== CREAR PEDIDO (Requiere autenticación) ==========
    @PostMapping
    public ResponseEntity<?> createOrder(
            @Valid @RequestBody OrderCreateDTO createDTO,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            OrderDTO order = orderService.createOrder(createDTO, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (InsufficientStockException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear el pedido: " + e.getMessage()));
        }
    }

    // ========== OBTENER MIS PEDIDOS ==========
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<OrderDTO> orders = orderService.getUserOrders(userEmail);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener pedidos"));
        }
    }

    // ========== OBTENER PEDIDO POR ID ==========
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            OrderDTO order = orderService.getOrderById(id, userEmail);
            return ResponseEntity.ok(order);
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener el pedido"));
        }
    }

    // ========== CANCELAR PEDIDO ==========
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            String cancellationReason = reason != null ? reason : "Cancelado por el usuario";
            OrderDTO order = orderService.cancelOrder(id, userEmail, cancellationReason);
            return ResponseEntity.ok(order);
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (OrderNotCancellableException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cancelar el pedido"));
        }
    }

    // ========== OBTENER TODOS LOS PEDIDOS (Solo ADMIN) ==========
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllOrders() {
        try {
            List<OrderDTO> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener pedidos"));
        }
    }

    // ========== OBTENER PEDIDOS POR ESTADO (Solo ADMIN) ==========
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable OrderStatus status) {
        try {
            List<OrderDTO> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener pedidos por estado"));
        }
    }

    // ========== ACTUALIZAR ESTADO (Solo ADMIN) ==========
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        try {
            OrderDTO order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(order);
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el estado"));
        }
    }

    // ========== ESTADÍSTICAS (Solo ADMIN) ==========
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOrderStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("pendingOrders", orderService.countOrdersByStatus(OrderStatus.PENDIENTE));
            stats.put("confirmedOrders", orderService.countOrdersByStatus(OrderStatus.CONFIRMADO));
            stats.put("deliveredOrders", orderService.countOrdersByStatus(OrderStatus.ENTREGADO));
            stats.put("cancelledOrders", orderService.countOrdersByStatus(OrderStatus.CANCELADO));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener estadísticas"));
        }
    }

    // ========== OBTENER ESTADOS DISPONIBLES ==========
    @GetMapping("/statuses")
    public ResponseEntity<?> getOrderStatuses() {
        try {
            Map<String, String> statuses = new HashMap<>();
            for (OrderStatus status : OrderStatus.values()) {
                statuses.put(status.name(), status.getDisplayName());
            }
            return ResponseEntity.ok(statuses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener estados"));
        }
    }

    // ========== OBTENER MÉTODOS DE PAGO DISPONIBLES ==========
    @GetMapping("/payment-methods")
    public ResponseEntity<?> getPaymentMethods() {
        try {
            Map<String, String> methods = new HashMap<>();
            for (com.caprisoft.caprisoft.entity.PaymentMethod method : 
                 com.caprisoft.caprisoft.entity.PaymentMethod.values()) {
                methods.put(method.name(), method.getDisplayName());
            }
            return ResponseEntity.ok(methods);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener métodos de pago"));
        }
    }
}