package com.greencircle.repository;

import com.greencircle.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    /**
     * Fetch all orders that contain at least one product belonging to the given farmer.
     * Distinct prevents duplicates when an order has multiple items from the same farmer.
     */
    @Query("""
            SELECT DISTINCT o FROM Order o
            JOIN o.items i
            WHERE i.product.farmer.id = :farmerId
            ORDER BY o.createdAt DESC
            """)
    List<Order> findOrdersContainingFarmerProducts(@Param("farmerId") Long farmerId);
}
