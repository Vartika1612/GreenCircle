package com.greencircle.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items",
       indexes = {
           @Index(name = "idx_orderitem_order",   columnList = "order_id"),
           @Index(name = "idx_orderitem_product", columnList = "product_id")
       })
@Data
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    /**
     * Price snapshot at time of order — preserves history even if product price changes later.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
