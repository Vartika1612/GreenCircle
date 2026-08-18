package com.greencircle.service;

import com.greencircle.dto.FarmerDashboardResponse;
import com.greencircle.exception.ResourceNotFoundException;
import com.greencircle.model.User;
import com.greencircle.repository.OrderItemRepository;
import com.greencircle.repository.ProductRepository;
import com.greencircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmerDashboardService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    public FarmerDashboardResponse getDashboard(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        var products = productRepository.findByFarmerId(farmer.getId());
        long total   = products.size();
        long active  = products.stream().filter(p -> p.getStock() > 0).count();
        long orders  = orderItemRepository.countOrdersByFarmerId(farmer.getId());
        var  sales   = orderItemRepository.sumSalesByFarmerId(farmer.getId());

        return new FarmerDashboardResponse(total, active, orders, sales);
    }
}
