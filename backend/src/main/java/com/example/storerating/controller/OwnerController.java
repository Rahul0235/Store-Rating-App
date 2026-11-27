package com.example.storerating.controller;

import com.example.storerating.dto.OwnerDashboardResponse;
import com.example.storerating.model.User;
import com.example.storerating.service.OwnerService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    @GetMapping("/dashboard")
    public OwnerDashboardResponse dashboard(@AuthenticationPrincipal User user) {
        return ownerService.getDashboard(user.getId());
    }
}
