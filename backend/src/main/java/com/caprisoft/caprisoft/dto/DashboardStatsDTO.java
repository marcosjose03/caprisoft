package com.caprisoft.caprisoft.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private Long totalProducts;
    private Long availableProducts;
    private Long outOfStockProducts;
    private Long lowStockProducts;
    
    private Long totalOrders;
    private Long pendingOrders;
    private Long confirmedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    
    private Long totalUsers;
    private Long activeUsers;
}