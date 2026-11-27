package com.example.storerating.controller;

import com.example.storerating.dto.RatingRequest;
import com.example.storerating.dto.UserStoreResponse;
import com.example.storerating.model.User;
import com.example.storerating.service.StoreService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping
    public List<UserStoreResponse> list(@AuthenticationPrincipal User user,
                                        @RequestParam(required = false) String name,
                                        @RequestParam(required = false) String address) {
        return storeService.listForUser(user.getId(), name, address);
    }

    @PostMapping("/{storeId}/rating")
    public Map<String, String> rate(@AuthenticationPrincipal User user,
                                    @PathVariable Long storeId,
                                    @Valid @RequestBody RatingRequest request) {
        storeService.rateStore(user.getId(), storeId, request.rating());
        return Map.of("message", "Rating saved");
    }
}
