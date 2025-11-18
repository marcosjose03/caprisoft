package com.caprisoft.caprisoft.controller;
import com.caprisoft.caprisoft.dto.ReportOrderDTO;
import com.caprisoft.caprisoft.dto.ReportStatsDTO;
import com.caprisoft.caprisoft.dto.ProductSalesDTO;
import com.caprisoft.caprisoft.service.ReportService;    
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReportService reportService;

    // ========== INFORME TABULAR ==========
    @GetMapping("/orders")
    public ResponseEntity<?> getOrdersReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<ReportOrderDTO> report = reportService.getOrdersReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al generar reporte: " + e.getMessage()));
        }
    }

    // ========== INFORME ESTADÍSTICO ==========
    @GetMapping("/statistics")
    public ResponseEntity<?> getStatisticsReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            ReportStatsDTO stats = reportService.getStatisticsReport(startDate, endDate);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al generar estadísticas: " + e.getMessage()));
        }
    }

    // ========== VENTAS POR PRODUCTO ==========
    @GetMapping("/sales-by-product")
    public ResponseEntity<?> getSalesByProduct(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<ProductSalesDTO> sales = reportService.getSalesByProduct(startDate, endDate);
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener ventas por producto: " + e.getMessage()));
        }
    }

    // ========== VENTAS POR CATEGORÍA ==========
    @GetMapping("/sales-by-category")
    public ResponseEntity<?> getSalesByCategory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> sales = reportService.getSalesByCategory(startDate, endDate);
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener ventas por categoría: " + e.getMessage()));
        }
    }

    // ========== VENTAS POR MES ==========
    @GetMapping("/sales-by-month")
    public ResponseEntity<?> getSalesByMonth(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Map<String, Object>> sales = reportService.getSalesByMonth(startDate, endDate);
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener ventas mensuales: " + e.getMessage()));
        }
    }

    // ========== TOP CLIENTES ==========
    @GetMapping("/top-customers")
    public ResponseEntity<?> getTopCustomers(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") Integer limit) {
        try {
            List<Map<String, Object>> customers = reportService.getTopCustomers(startDate, endDate, limit);
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener top clientes: " + e.getMessage()));
        }
    }
}