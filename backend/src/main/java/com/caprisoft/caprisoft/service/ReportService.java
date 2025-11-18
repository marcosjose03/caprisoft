package com.caprisoft.caprisoft.service;

import com.caprisoft.caprisoft.dto.ProductSalesDTO;
import com.caprisoft.caprisoft.dto.ReportOrderDTO;
import com.caprisoft.caprisoft.dto.ReportStatsDTO;
import com.caprisoft.caprisoft.entity.Order;
import com.caprisoft.caprisoft.entity.OrderStatus;
import com.caprisoft.caprisoft.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;

    // ========== INFORME TABULAR DE PEDIDOS ==========
    @Transactional(readOnly = true)
    public List<ReportOrderDTO> getOrdersReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);

        return orders.stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELADO)
                .map(order -> ReportOrderDTO.builder()
                        .orderNumber(order.getOrderNumber())
                        .customerName(order.getUser().getFullName())
                        .orderDate(order.getCreatedAt())
                        .status(order.getStatus().getDisplayName())
                        .totalAmount(order.getTotalAmount())
                        .itemCount(order.getItems().size())
                        .paymentMethod(order.getPaymentMethod().getDisplayName())
                        .build())
                .collect(Collectors.toList());
    }

    // ========== ESTADÍSTICAS GENERALES ==========
    @Transactional(readOnly = true)
    public ReportStatsDTO getStatisticsReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
        List<Order> deliveredOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.ENTREGADO)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = deliveredOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Long totalOrders = (long) orders.size();
        Long deliveredOrdersCount = (long) deliveredOrders.size();
        
        BigDecimal averageOrderValue = deliveredOrdersCount > 0 
                ? totalRevenue.divide(BigDecimal.valueOf(deliveredOrdersCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return ReportStatsDTO.builder()
                .totalOrders(totalOrders)
                .deliveredOrders(deliveredOrdersCount)
                .totalRevenue(totalRevenue)
                .averageOrderValue(averageOrderValue)
                .periodStart(startDate)
                .periodEnd(endDate)
                .build();
    }

    // ========== VENTAS POR PRODUCTO ==========
    @Transactional(readOnly = true)
    public List<ProductSalesDTO> getSalesByProduct(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.ENTREGADO)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, ProductSalesDTO> productSalesMap = new HashMap<>();

        orders.forEach(order -> 
            order.getItems().forEach(item -> {
                String productName = item.getProductName();
                productSalesMap.compute(productName, (key, existing) -> {
                    if (existing == null) {
                        return ProductSalesDTO.builder()
                                .productName(productName)
                                .totalQuantity(item.getQuantity())
                                .totalRevenue(item.getSubtotal())
                                .orderCount(1L)
                                .build();
                    } else {
                        existing.setTotalQuantity(existing.getTotalQuantity() + item.getQuantity());
                        existing.setTotalRevenue(existing.getTotalRevenue().add(item.getSubtotal()));
                        existing.setOrderCount(existing.getOrderCount() + 1);
                        return existing;
                    }
                });
            })
        );

        // Calcular porcentaje de participación
        productSalesMap.values().forEach(dto -> {
            if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal percentage = dto.getTotalRevenue()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(totalRevenue, 2, RoundingMode.HALF_UP);
                dto.setPercentageOfTotal(percentage);
            }
        });

        return productSalesMap.values().stream()
                .sorted((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()))
                .collect(Collectors.toList());
    }

    // ========== VENTAS POR CATEGORÍA ==========
    @Transactional(readOnly = true)
    public Map<String, Object> getSalesByCategory(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.ENTREGADO)
                .collect(Collectors.toList());

        Map<String, BigDecimal> categorySales = new HashMap<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Order order : orders) {
            for (var item : order.getItems()) {
                String category = item.getProduct().getCategory().getDisplayName();
                categorySales.merge(category, item.getSubtotal(), BigDecimal::add);
                totalRevenue = totalRevenue.add(item.getSubtotal());
            }
        }

        List<Map<String, Object>> data = new ArrayList<>();
        BigDecimal finalTotalRevenue = totalRevenue;
        
        categorySales.forEach((category, revenue) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("category", category);
            entry.put("revenue", revenue);
            
            if (finalTotalRevenue.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal percentage = revenue.multiply(BigDecimal.valueOf(100))
                        .divide(finalTotalRevenue, 2, RoundingMode.HALF_UP);
                entry.put("percentage", percentage);
            } else {
                entry.put("percentage", BigDecimal.ZERO);
            }
            
            data.add(entry);
        });

        data.sort((a, b) -> ((BigDecimal) b.get("revenue")).compareTo((BigDecimal) a.get("revenue")));

        Map<String, Object> result = new HashMap<>();
        result.put("data", data);
        result.put("totalRevenue", totalRevenue);
        
        return result;
    }

    // ========== VENTAS POR MES ==========
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getSalesByMonth(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.ENTREGADO)
                .collect(Collectors.toList());

        Map<String, BigDecimal> monthlySales = new TreeMap<>();

        orders.forEach(order -> {
            String monthKey = order.getCreatedAt().getYear() + "-" + 
                    String.format("%02d", order.getCreatedAt().getMonthValue());
            monthlySales.merge(monthKey, order.getTotalAmount(), BigDecimal::add);
        });

        List<Map<String, Object>> result = new ArrayList<>();
        monthlySales.forEach((month, revenue) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month);
            entry.put("revenue", revenue);
            result.add(entry);
        });

        return result;
    }

    // ========== TOP CLIENTES ==========
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTopCustomers(LocalDate startDate, LocalDate endDate, Integer limit) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end)
                .stream()
                .filter(o -> o.getStatus() == OrderStatus.ENTREGADO)
                .collect(Collectors.toList());

        Map<String, Map<String, Object>> customerData = new HashMap<>();

        orders.forEach(order -> {
            String customerName = order.getUser().getFullName();
            customerData.compute(customerName, (key, data) -> {
                if (data == null) {
                    data = new HashMap<>();
                    data.put("customerName", customerName);
                    data.put("totalSpent", order.getTotalAmount());
                    data.put("orderCount", 1L);
                } else {
                    BigDecimal currentTotal = (BigDecimal) data.get("totalSpent");
                    data.put("totalSpent", currentTotal.add(order.getTotalAmount()));
                    data.put("orderCount", (Long) data.get("orderCount") + 1);
                }
                return data;
            });
        });

        return customerData.values().stream()
                .sorted((a, b) -> ((BigDecimal) b.get("totalSpent"))
                        .compareTo((BigDecimal) a.get("totalSpent")))
                .limit(limit)
                .collect(Collectors.toList());
    }
}