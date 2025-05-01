package com.example.auth_service.service;

import com.example.auth_service.model.User;
import com.example.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Register a new user
    public void registerUser(String name, String email, String password) throws Exception {
        // Check if email already exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new Exception("Email already registered");
        }

        // Create new user (store raw password)
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setPassword(password); // Storing plaintext password (for simplicity)

        // Save the user to DB
        userRepository.save(newUser);
    }

    // Login a user using email and password
    public Optional<User> loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        // Check password directly (plaintext comparison)
        if (user.isPresent() && password.equals(user.get().getPassword())) {
            return user;
        }

        return Optional.empty(); // Login failed
    }
}
