package com.caprisoft.caprisoft.service;

import com.caprisoft.caprisoft.dto.OrderCreateDTO;
import com.caprisoft.caprisoft.dto.OrderDTO;
import com.caprisoft.caprisoft.dto.OrderItemCreateDTO;
import com.caprisoft.caprisoft.entity.*;
import com.caprisoft.caprisoft.exception.InsufficientStockException;
import com.caprisoft.caprisoft.exception.OrderNotCancellableException;
import com.caprisoft.caprisoft.exception.OrderNotFoundException;
import com.caprisoft.caprisoft.exception.ProductNotFoundException;
import com.caprisoft.caprisoft.mapper.OrderMapper;
import com.caprisoft.caprisoft.repository.OrderRepository;
import com.caprisoft.caprisoft.repository.ProductRepository;
import com.caprisoft.caprisoft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    // ========== CREAR PEDIDO ==========
    @Transactional
    public OrderDTO createOrder(OrderCreateDTO createDTO, String userEmail) {
        // Buscar usuario
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Crear orden
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .status(OrderStatus.PENDIENTE)
                .paymentMethod(createDTO.getPaymentMethod())
                .deliveryName(createDTO.getDeliveryName())
                .deliveryPhone(createDTO.getDeliveryPhone())
                .deliveryAddress(createDTO.getDeliveryAddress())
                .deliveryCity(createDTO.getDeliveryCity())
                .notes(createDTO.getNotes())
                .totalAmount(BigDecimal.ZERO)
                .build();

        // Agregar items y validar stock
        for (OrderItemCreateDTO itemDTO : createDTO.getItems()) {
            Product product = productRepository.findByIdAndIsActiveTrue(itemDTO.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException(itemDTO.getProductId()));

            // Validar stock
            if (!product.hasStock(itemDTO.getQuantity())) {
                throw new InsufficientStockException(
                    product.getId(), 
                    itemDTO.getQuantity(), 
                    product.getStock()
                );
            }

            // Crear item de pedido
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .productName(product.getName())
                    .unitPrice(product.getPrice())
                    .quantity(itemDTO.getQuantity())
                    .unit(product.getUnit())
                    .build();

            orderItem.calculateSubtotal();
            order.addItem(orderItem);

            // Reducir stock del producto
            product.reduceStock(itemDTO.getQuantity());
            productRepository.save(product);
        }

        // Calcular total
        order.calculateTotal();

        // Guardar orden
        Order savedOrder = orderRepository.save(order);

        return orderMapper.toDTO(savedOrder);
    }

    // ========== OBTENER PEDIDOS DEL USUARIO ==========
    @Transactional(readOnly = true)
    public List<OrderDTO> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== OBTENER PEDIDO POR ID ==========
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        // Verificar que el pedido pertenezca al usuario (excepto si es ADMIN)
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new OrderNotFoundException("No tienes permiso para ver este pedido");
        }

        return orderMapper.toDTO(order);
    }

    // ========== OBTENER TODOS LOS PEDIDOS (ADMIN) ==========
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== OBTENER PEDIDOS POR ESTADO ==========
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // ========== CANCELAR PEDIDO ==========
    @Transactional
    public OrderDTO cancelOrder(Long id, String userEmail, String reason) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        // Verificar que el pedido pertenezca al usuario
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new OrderNotFoundException("No tienes permiso para cancelar este pedido");
        }

        // Solo se pueden cancelar pedidos PENDIENTES o CONFIRMADOS
        if (order.getStatus() != OrderStatus.PENDIENTE && 
            order.getStatus() != OrderStatus.CONFIRMADO) {
            throw new OrderNotCancellableException(
                "Solo se pueden cancelar pedidos pendientes o confirmados"
            );
        }

        // Devolver stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.addStock(item.getQuantity());
            productRepository.save(product);
        }

        // Actualizar estado
        order.setStatus(OrderStatus.CANCELADO);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancellationReason(reason);

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toDTO(savedOrder);
    }

    // ========== ACTUALIZAR ESTADO (ADMIN) ==========
    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        order.setStatus(newStatus);

        if (newStatus == OrderStatus.ENTREGADO) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toDTO(savedOrder);
    }

    // ========== ESTADÍSTICAS ==========
    @Transactional(readOnly = true)
    public Long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    @Transactional(readOnly = true)
    public Long countUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return orderRepository.countByUserId(user.getId());
    }

    // ========== GENERAR NÚMERO DE ORDEN ==========
    private String generateOrderNumber() {
        String lastOrderNumber = orderRepository.findLastOrderNumber();
        
        if (lastOrderNumber == null) {
            return "ORD-000001";
        }

        // Extraer el número y sumarle 1
        String[] parts = lastOrderNumber.split("-");
        int number = Integer.parseInt(parts[1]) + 1;
        
        return String.format("ORD-%06d", number);
    }
}