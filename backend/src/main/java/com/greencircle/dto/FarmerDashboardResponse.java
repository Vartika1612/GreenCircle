package com.greencircle.dto;

import java.math.BigDecimal;

public class FarmerDashboardResponse {
    private long totalProducts;
    private long activeProducts;   // products with stock > 0
    private long totalOrders;
    private BigDecimal salesTotal;

    public FarmerDashboardResponse() {}

    public FarmerDashboardResponse(long totalProducts, long activeProducts, long totalOrders, BigDecimal salesTotal) {
        this.totalProducts = totalProducts;
        this.activeProducts = activeProducts;
        this.totalOrders = totalOrders;
        this.salesTotal = salesTotal;
    }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public long getActiveProducts() { return activeProducts; }
    public void setActiveProducts(long activeProducts) { this.activeProducts = activeProducts; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getSalesTotal() { return salesTotal; }
    public void setSalesTotal(BigDecimal salesTotal) { this.salesTotal = salesTotal; }
}
