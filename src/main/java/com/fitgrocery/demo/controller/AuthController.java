package com.fitgrocery.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fitgrocery.demo.entity.User;
import com.fitgrocery.demo.repository.UserRepository;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // REGISTER USER
    @PostMapping("/register")
    public User register(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // LOGIN (USER + ADMIN)
    @PostMapping("/login")
    public User login(@RequestBody User loginData) {

        User user = userRepository.findByEmail(loginData.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(loginData.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}