package com.greencircle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class FarmerDashboardResponse {
    private long totalProducts;
    private long activeProducts;   // products with stock > 0
    private long totalOrders;
    private BigDecimal salesTotal;
}
