package com.greencircle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.greencircle.dto.LoginRequest;
import com.greencircle.dto.ProductRequest;
import com.greencircle.model.ProductCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    private String farmerToken;
    private String farmer2Token;
    private String customerToken;

    @BeforeEach
    void setUp() throws Exception {
        farmerToken   = login("farmer@greencircle.com",  "password123");
        farmer2Token  = login("farmer2@greencircle.com", "password123");
        customerToken = login("customer@greencircle.com","password123");
    }

    @Test
    void getProducts_public_returns200() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void createProduct_asFarmer_returns201() throws Exception {
        ProductRequest req = sampleProduct();
        mockMvc.perform(post("/api/products")
                .header("Authorization", "Bearer " + farmerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Carrots"))
                .andExpect(jsonPath("$.farmer.name").exists());
    }

    @Test
    void createProduct_asCustomer_returns403() throws Exception {
        mockMvc.perform(post("/api/products")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleProduct())))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateProduct_byDifferentFarmer_returns403() throws Exception {
        // Create product as farmer 1 (product id=1 is seeded)
        mockMvc.perform(put("/api/products/1")
                .header("Authorization", "Bearer " + farmer2Token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleProduct())))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateProduct_byOwner_returns200() throws Exception {
        mockMvc.perform(put("/api/products/1")
                .header("Authorization", "Bearer " + farmerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleProduct())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Carrots"));
    }

    @Test
    void deleteProduct_byOwner_returns204() throws Exception {
        mockMvc.perform(delete("/api/products/1")
                .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void searchByCategory_returnsFiltered() throws Exception {
        mockMvc.perform(get("/api/products?category=HONEY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("HONEY"));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String login(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail(email);
        req.setPassword(password);
        String body = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("token").asText();
    }

    private ProductRequest sampleProduct() {
        ProductRequest r = new ProductRequest();
        r.setName("Test Carrots");
        r.setDescription("Fresh organic carrots");
        r.setCategory(ProductCategory.VEGETABLES);
        r.setPrice(new BigDecimal("3.50"));
        r.setUnit("lb");
        r.setStock(50);
        r.setLocation("Napa Valley, CA");
        r.setFarmingMethod("Certified Organic");
        return r;
    }
}
