package com.example.auth_service.controller;

import com.example.auth_service.model.User;
import com.example.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allow requests from frontend (you can restrict it later)
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register endpoint
    @PostMapping("/register")
    public Map<String, String> registerUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {

        Map<String, String> response = new HashMap<>();

        try {
            authService.registerUser(name, email, password);
            response.put("message", "User registered successfully");
        } catch (Exception e) {
            response.put("error", e.getMessage());
            System.out.println(e.getMessage());
        }

        return response;
    }

    // Login endpoint
    @PostMapping("/login")
    public Object loginUser(
            @RequestParam String email,
            @RequestParam String password) {

        Optional<User> user = authService.loginUser(email, password);

        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.get().getId());
            response.put("name", user.get().getName());
            return response;
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return error;
        }
    }
}

