package com.greencircle.dto;

import com.greencircle.model.UserRole;

public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private UserRole role;
    private String location;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String name, String email, UserRole role, String location) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.location = location;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
