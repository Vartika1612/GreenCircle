package com.greencircle.service;

import com.greencircle.dto.FarmerDashboardResponse;
import com.greencircle.exception.ResourceNotFoundException;
import com.greencircle.model.User;
import com.greencircle.repository.OrderItemRepository;
import com.greencircle.repository.ProductRepository;
import com.greencircle.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FarmerDashboardService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    public FarmerDashboardService(ProductRepository productRepository, OrderItemRepository orderItemRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
    }

    public FarmerDashboardResponse getDashboard(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        var products = productRepository.findByFarmerId(farmer.getId());
        long total   = products.size();
        long active  = products.stream().filter(p -> p.getStock() > 0).count();
        long orders  = orderItemRepository.countOrdersByFarmerId(farmer.getId());
        BigDecimal sales = orderItemRepository.sumSalesByFarmerId(farmer.getId());
        if (sales == null) sales = BigDecimal.ZERO;

        return new FarmerDashboardResponse(total, active, orders, sales);
    }
}
