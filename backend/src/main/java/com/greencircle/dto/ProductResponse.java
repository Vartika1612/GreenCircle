package com.greencircle.dto;

import com.greencircle.model.ProductCategory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    public ProductResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProductCategory getCategory() { return category; }
    public void setCategory(ProductCategory category) { this.category = category; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getImageKey() { return imageKey; }
    public void setImageKey(String imageKey) { this.imageKey = imageKey; }

    public String getFarmingMethod() { return farmingMethod; }
    public void setFarmingMethod(String farmingMethod) { this.farmingMethod = farmingMethod; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public UserSummaryResponse getFarmer() { return farmer; }
    public void setFarmer(UserSummaryResponse farmer) { this.farmer = farmer; }
}
