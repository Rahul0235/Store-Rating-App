package com.example.storerating.dto;

public record StoreResponse(Long id, String name, String email, String address, Double rating, Long ratingCount) {
}
