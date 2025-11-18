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
public class ProductSalesDTO {
    private String productName;
    private Integer totalQuantity;
    private BigDecimal totalRevenue;
    private Long orderCount;
    private BigDecimal percentageOfTotal;
}