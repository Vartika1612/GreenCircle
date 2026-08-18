package com.greencircle.repository;

import com.greencircle.model.Product;
import com.greencircle.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByFarmerId(Long farmerId);

    /**
     * Search + filter with optional parameters.
     * All conditions are optional — null means "no filter".
     */
    @Query("""
            SELECT p FROM Product p
            WHERE (:search   IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND   (:category IS NULL OR p.category = :category)
            AND   (:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%')))
            ORDER BY p.createdAt DESC
            """)
    List<Product> search(
            @Param("search")   String search,
            @Param("category") ProductCategory category,
            @Param("location") String location
    );
}
