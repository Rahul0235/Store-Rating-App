package com.example.storerating.dto;

import com.example.storerating.model.Role;
import com.example.storerating.model.User;

public record UserResponse(Long id, String name, String email, String address, Role role, Double rating) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getAddress(), user.getRole(), null);
    }

    public static UserResponse from(User user, Double rating) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),
                user.getAddress(), user.getRole(), rating);
    }
}
