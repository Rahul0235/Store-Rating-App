package com.example.storerating.dto;

public record UserStoreResponse(Long id, String name, String address, Double overallRating, Integer userRating) {
}
