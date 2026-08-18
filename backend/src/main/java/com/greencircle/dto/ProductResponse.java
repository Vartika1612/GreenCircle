package com.greencircle.dto;

import com.greencircle.model.ProductCategory;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private ProductCategory category;
    private BigDecimal price;
    private String unit;
    private Integer stock;
    private String imageKey;
    private String farmingMethod;
    private String location;
    private LocalDateTime createdAt;
    private UserSummaryResponse farmer;
}
