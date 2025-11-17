package com.caprisoft.caprisoft.repository;

import com.caprisoft.caprisoft.entity.Order;
import com.caprisoft.caprisoft.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Buscar por número de orden
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // Buscar pedidos de un usuario
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Buscar por usuario y estado
    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, OrderStatus status);
    
    // Buscar por estado
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    
    // Buscar pedidos entre fechas
    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Contar pedidos por estado
    Long countByStatus(OrderStatus status);
    
    // Contar pedidos de un usuario
    Long countByUserId(Long userId);
    
    // Último número de orden (para generar el siguiente)
    @Query("SELECT MAX(o.orderNumber) FROM Order o")
    String findLastOrderNumber();
    
    List<Order> findByStatus(OrderStatus status);
}