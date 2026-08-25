package com.greencircle.dto;

import com.greencircle.model.ProductCategory;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 150)
    private String name;

    private String description;

    @NotNull(message = "Category is required")
    private ProductCategory category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Unit is required")
    @Size(max = 50)
    private String unit;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private String imageKey;
    private String farmingMethod;
    private String location;

    public ProductRequest() {}

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
}
