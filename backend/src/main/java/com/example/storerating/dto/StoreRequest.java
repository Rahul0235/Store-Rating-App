package com.example.storerating.dto;

import jakarta.validation.constraints.*;

public record StoreRequest(
        @NotBlank(message = ValidationRules.NAME_MESSAGE)
        @Size(min = 20, max = 60, message = ValidationRules.NAME_MESSAGE)
        String name,

        @NotBlank(message = ValidationRules.EMAIL_MESSAGE)
        @Pattern(regexp = ValidationRules.EMAIL_REGEX, message = ValidationRules.EMAIL_MESSAGE)
        String email,

        @NotBlank(message = ValidationRules.ADDRESS_MESSAGE)
        @Size(max = 400, message = ValidationRules.ADDRESS_MESSAGE)
        String address,

        // optional: email of an existing store owner account
        String ownerEmail) {
}
