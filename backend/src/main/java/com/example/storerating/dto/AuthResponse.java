package com.example.storerating.dto;

import com.example.storerating.model.Role;

public record AuthResponse(String token, Long id, String name, String email, Role role) {
}
