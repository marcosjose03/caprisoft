package com.caprisoft.caprisoft.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportStatsDTO {
    private Long totalOrders;
    private Long deliveredOrders;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
    private LocalDate periodStart;
    private LocalDate periodEnd;
}