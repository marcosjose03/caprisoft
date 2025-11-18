package com.caprisoft.caprisoft.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportOrderDTO {
    private String orderNumber;
    private String customerName;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
    private Integer itemCount;
    private String paymentMethod;
}
