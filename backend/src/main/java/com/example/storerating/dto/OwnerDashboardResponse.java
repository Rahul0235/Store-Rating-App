package com.example.storerating.dto;

import java.util.List;

public record OwnerDashboardResponse(String storeName, Double averageRating, List<RaterResponse> ratings) {
}
