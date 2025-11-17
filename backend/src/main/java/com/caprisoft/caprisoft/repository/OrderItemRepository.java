package com.caprisoft.caprisoft.repository;

import com.caprisoft.caprisoft.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Buscar items de una orden
    List<OrderItem> findByOrderId(Long orderId);
    
    // Buscar items de un producto
    List<OrderItem> findByProductId(Long productId);
}