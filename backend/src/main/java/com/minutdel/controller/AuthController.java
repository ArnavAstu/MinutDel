package com.minutdel.controller;

import com.minutdel.dto.AuthRequest;
import com.minutdel.dto.AuthResponse;
import com.minutdel.dto.RegisterRequest;
import com.minutdel.model.User;
import com.minutdel.repository.UserRepository;
import com.minutdel.service.SecurityTokenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final SecurityTokenService securityTokenService;

    public AuthController(UserRepository userRepository, SecurityTokenService securityTokenService) {
        this.userRepository = userRepository;
        this.securityTokenService = securityTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            return ResponseEntity.badRequest().body(Map.of("error", "An account with this email already exists."));
        }

        String passwordHash = securityTokenService.hashPassword(request.getPassword());
        User user = new User(normalizedEmail, passwordHash, request.getFullName().trim(), request.getPhone(), "ROLE_CUSTOMER");
        User savedUser = userRepository.save(user);

        String token = securityTokenService.generateToken(savedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user == null || !securityTokenService.verifyPassword(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password."));
        }

        String token = securityTokenService.generateToken(user);
        return ResponseEntity.ok(
                new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        SecurityTokenService.TokenPrincipal principal = securityTokenService.validateToken(authHeader);
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token."));
        }

        return userRepository.findById(principal.getUserId())
                .map(u -> ResponseEntity.ok(new AuthResponse(authHeader, u.getId(), u.getEmail(), u.getFullName(), u.getRole())))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
