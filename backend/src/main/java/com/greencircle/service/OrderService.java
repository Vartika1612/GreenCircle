package com.greencircle.service;

import com.greencircle.dto.CreateOrderRequest;
import com.greencircle.dto.OrderItemResponse;
import com.greencircle.dto.OrderResponse;
import com.greencircle.exception.ResourceNotFoundException;
import com.greencircle.exception.UnauthorizedException;
import com.greencircle.exception.ValidationException;
import com.greencircle.model.*;
import com.greencircle.repository.OrderRepository;
import com.greencircle.repository.ProductRepository;
import com.greencircle.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setStatus(OrderStatus.PLACED);

        BigDecimal total = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found: " + itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new ValidationException(
                        "Insufficient stock for product: " + product.getName() +
                        " (available: " + product.getStock() + ")");
            }

            // Decrement stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());  // snapshot price

            order.getItems().add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        order.setTotalAmount(total);
        order = orderRepository.save(order);
        return toResponse(order);
    }

    public List<OrderResponse> getCustomerOrders(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(this::toResponse).toList();
    }

    public OrderResponse getOrderById(Long orderId, String requesterEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        // Allow access to the customer who placed it, or a farmer whose product is in it
        boolean isCustomer = order.getCustomer().getEmail().equalsIgnoreCase(requesterEmail);
        boolean isFarmerWithItem = order.getItems().stream()
                .anyMatch(i -> i.getProduct().getFarmer().getEmail().equalsIgnoreCase(requesterEmail));

        if (!isCustomer && !isFarmerWithItem) {
            throw new UnauthorizedException("Access denied to this order");
        }

        return toResponse(order);
    }

    public List<OrderResponse> getFarmerOrders(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));
        return orderRepository.findOrdersContainingFarmerProducts(farmer.getId())
                .stream().map(this::toResponse).toList();
    }

    // ── Mapping ──────────────────────────────────────────────────────────────

    private OrderResponse toResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setStatus(o.getStatus());
        r.setTotalAmount(o.getTotalAmount());
        r.setCreatedAt(o.getCreatedAt());
        r.setItems(o.getItems().stream().map(this::toItemResponse).toList());
        return r;
    }

    private OrderItemResponse toItemResponse(OrderItem i) {
        OrderItemResponse r = new OrderItemResponse();
        r.setProductId(i.getProduct().getId());
        r.setProductName(i.getProduct().getName());
        r.setQuantity(i.getQuantity());
        r.setPrice(i.getPrice());
        r.setLineTotal(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())));
        return r;
    }
}
