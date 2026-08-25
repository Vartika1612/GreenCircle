package com.greencircle.service;

import com.greencircle.dto.AuthResponse;
import com.greencircle.dto.LoginRequest;
import com.greencircle.dto.RegisterRequest;
import com.greencircle.exception.ValidationException;
import com.greencircle.model.User;
import com.greencircle.repository.UserRepository;
import com.greencircle.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setLocation(request.getLocation());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return toResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return toResponse(token, user);
    }

    private AuthResponse toResponse(String token, User user) {
        return new AuthResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole(), user.getLocation());
    }
}
