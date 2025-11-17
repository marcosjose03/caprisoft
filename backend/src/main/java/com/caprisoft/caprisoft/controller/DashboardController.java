package com.caprisoft.caprisoft.controller;

import com.caprisoft.caprisoft.dto.DashboardStatsDTO;
import com.caprisoft.caprisoft.entity.OrderStatus;
import com.caprisoft.caprisoft.entity.ProductStatus;
import com.caprisoft.caprisoft.repository.OrderRepository;
import com.caprisoft.caprisoft.repository.ProductRepository;
import com.caprisoft.caprisoft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Stats de productos
            Long totalProducts = productRepository.count();
            Long availableProducts = productRepository.countByStatusAndIsActiveTrue(ProductStatus.DISPONIBLE);
            Long outOfStockProducts = productRepository.countByStatusAndIsActiveTrue(ProductStatus.AGOTADO);
            Long lowStockProducts = (long) productRepository.findLowStockProducts(10).size();

            // Stats de pedidos
            Long totalOrders = orderRepository.count();
            Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDIENTE);
            Long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMADO);
            Long deliveredOrders = orderRepository.countByStatus(OrderStatus.ENTREGADO);
            Long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELADO);

            // Revenue (suma total de pedidos entregados)
            BigDecimal totalRevenue = orderRepository.findByStatus(OrderStatus.ENTREGADO)
                    .stream()
                    .map(order -> order.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Revenue mensual (pedidos entregados del mes actual)
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfMonth = LocalDateTime.now().withDayOfMonth(1).plusMonths(1).minusDays(1).withHour(23).withMinute(59).withSecond(59);
            
            BigDecimal monthlyRevenue = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startOfMonth, endOfMonth)
                    .stream()
                    .filter(order -> order.getStatus() == OrderStatus.ENTREGADO)
                    .map(order -> order.getTotalAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Stats de usuarios
            Long totalUsers = userRepository.count();
            Long activeUsers = userRepository.countByIsActiveTrue();

            DashboardStatsDTO stats = DashboardStatsDTO.builder()
                    .totalProducts(totalProducts)
                    .availableProducts(availableProducts)
                    .outOfStockProducts(outOfStockProducts)
                    .lowStockProducts(lowStockProducts)
                    .totalOrders(totalOrders)
                    .pendingOrders(pendingOrders)
                    .confirmedOrders(confirmedOrders)
                    .deliveredOrders(deliveredOrders)
                    .cancelledOrders(cancelledOrders)
                    .totalRevenue(totalRevenue)
                    .monthlyRevenue(monthlyRevenue)
                    .totalUsers(totalUsers)
                    .activeUsers(activeUsers)
                    .build();

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al obtener estadísticas: " + e.getMessage()));
        }
    }
}