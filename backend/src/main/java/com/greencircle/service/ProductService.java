package com.greencircle.service;

import com.greencircle.dto.ProductRequest;
import com.greencircle.dto.ProductResponse;
import com.greencircle.dto.UserSummaryResponse;
import com.greencircle.exception.ResourceNotFoundException;
import com.greencircle.exception.UnauthorizedException;
import com.greencircle.model.Product;
import com.greencircle.model.ProductCategory;
import com.greencircle.model.User;
import com.greencircle.repository.ProductRepository;
import com.greencircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ProductResponse> search(String search, String category, String location) {
        ProductCategory cat = null;
        if (category != null && !category.isBlank()) {
            try { cat = ProductCategory.valueOf(category.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        return productRepository.search(
                        search == null || search.isBlank() ? null : search,
                        cat,
                        location == null || location.isBlank() ? null : location)
                .stream().map(this::toResponse).toList();
    }

    public ProductResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<ProductResponse> getByFarmer(Long farmerId) {
        return productRepository.findByFarmerId(farmerId)
                .stream().map(this::toResponse).toList();
    }

    public List<ProductResponse> getByFarmerEmail(String email) {
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));
        return getByFarmer(farmer.getId());
    }

    @Transactional
    public ProductResponse create(ProductRequest request, String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));

        Product product = new Product();
        mapRequestToProduct(request, product);
        product.setFarmer(farmer);

        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request, String farmerEmail) {
        Product product = findOrThrow(id);
        assertOwnership(product, farmerEmail);

        mapRequestToProduct(request, product);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id, String farmerEmail) {
        Product product = findOrThrow(id);
        assertOwnership(product, farmerEmail);
        productRepository.delete(product);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private void assertOwnership(Product product, String farmerEmail) {
        if (!product.getFarmer().getEmail().equalsIgnoreCase(farmerEmail)) {
            throw new UnauthorizedException("You do not own this product");
        }
    }

    private void mapRequestToProduct(ProductRequest req, Product product) {
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setCategory(req.getCategory());
        product.setPrice(req.getPrice());
        product.setUnit(req.getUnit());
        product.setStock(req.getStock());
        product.setImageKey(req.getImageKey());
        product.setFarmingMethod(req.getFarmingMethod());
        product.setLocation(req.getLocation());
    }

    public ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setCategory(p.getCategory());
        r.setPrice(p.getPrice());
        r.setUnit(p.getUnit());
        r.setStock(p.getStock());
        r.setImageKey(p.getImageKey());
        r.setFarmingMethod(p.getFarmingMethod());
        r.setLocation(p.getLocation());
        r.setCreatedAt(p.getCreatedAt());
        r.setFarmer(new UserSummaryResponse(
                p.getFarmer().getId(), p.getFarmer().getName(), p.getFarmer().getLocation()));
        return r;
    }
}
