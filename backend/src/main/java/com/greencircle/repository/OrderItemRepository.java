package com.greencircle.repository;

import com.greencircle.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /** Count distinct orders containing at least one product from this farmer. */
    @Query("""
            SELECT COUNT(DISTINCT i.order.id) FROM OrderItem i
            WHERE i.product.farmer.id = :farmerId
            """)
    long countOrdersByFarmerId(@Param("farmerId") Long farmerId);

    /** Sum of revenue for a given farmer across all completed/confirmed/placed orders. */
    @Query("""
            SELECT COALESCE(SUM(i.price * i.quantity), 0) FROM OrderItem i
            WHERE i.product.farmer.id = :farmerId
            """)
    BigDecimal sumSalesByFarmerId(@Param("farmerId") Long farmerId);
}
