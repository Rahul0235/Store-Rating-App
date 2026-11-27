package com.example.storerating.dto;

import com.example.storerating.model.Role;
import jakarta.validation.constraints.*;

public record UserRequest(
        @NotBlank(message = ValidationRules.NAME_MESSAGE)
        @Size(min = 20, max = 60, message = ValidationRules.NAME_MESSAGE)
        String name,

        @NotBlank(message = ValidationRules.EMAIL_MESSAGE)
        @Pattern(regexp = ValidationRules.EMAIL_REGEX, message = ValidationRules.EMAIL_MESSAGE)
        String email,

        @NotBlank(message = ValidationRules.ADDRESS_MESSAGE)
        @Size(max = 400, message = ValidationRules.ADDRESS_MESSAGE)
        String address,

        @NotBlank(message = ValidationRules.PASSWORD_MESSAGE)
        @Pattern(regexp = ValidationRules.PASSWORD_REGEX, message = ValidationRules.PASSWORD_MESSAGE)
        String password,

        @NotNull(message = "Role is required")
        Role role) {
}
