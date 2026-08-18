package com.greencircle.controller;

import com.greencircle.dto.FarmerDashboardResponse;
import com.greencircle.dto.OrderResponse;
import com.greencircle.dto.ProductResponse;
import com.greencircle.service.FarmerDashboardService;
import com.greencircle.service.OrderService;
import com.greencircle.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
public class FarmerController {

    private final ProductService productService;
    private final OrderService orderService;
    private final FarmerDashboardService dashboardService;

    /** FARMER — own product listings */
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserDetails principal) {
        // Resolve farmer ID via email
        return ResponseEntity.ok(
                productService.getByFarmerEmail(principal.getUsername()));
    }

    /** FARMER — orders containing their products */
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(orderService.getFarmerOrders(principal.getUsername()));
    }

    /** FARMER — dashboard stats */
    @GetMapping("/dashboard")
    public ResponseEntity<FarmerDashboardResponse> getDashboard(
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(dashboardService.getDashboard(principal.getUsername()));
    }
}
