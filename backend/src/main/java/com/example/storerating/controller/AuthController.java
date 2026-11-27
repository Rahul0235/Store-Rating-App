package com.example.storerating.controller;

import com.example.storerating.dto.*;
import com.example.storerating.model.User;
import com.example.storerating.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PutMapping("/password")
    public Map<String, String> changePassword(@AuthenticationPrincipal User user,
                                              @Valid @RequestBody PasswordRequest request) {
        authService.changePassword(user.getId(), request);
        return Map.of("message", "Password updated successfully");
    }
}
