package com.example.storerating.service;

import com.example.storerating.dto.OwnerDashboardResponse;
import com.example.storerating.dto.RaterResponse;
import com.example.storerating.model.Store;
import com.example.storerating.repository.RatingRepository;
import com.example.storerating.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {

    private final StoreRepository storeRepository;
    private final RatingRepository ratingRepository;

    public OwnerService(StoreRepository storeRepository, RatingRepository ratingRepository) {
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;
    }

    @Transactional(readOnly = true)
    public OwnerDashboardResponse getDashboard(Long ownerId) {
        Optional<Store> found = storeRepository.findByOwnerId(ownerId);
        if (found.isEmpty()) {
            return new OwnerDashboardResponse(null, null, List.of());
        }

        Store store = found.get();
        List<RaterResponse> raters = ratingRepository.findByStoreWithUser(store.getId()).stream()
                .map(r -> new RaterResponse(r.getUser().getId(), r.getUser().getName(),
                        r.getUser().getEmail(), r.getScore()))
                .toList();

        return new OwnerDashboardResponse(store.getName(),
                ratingRepository.averageForStore(store.getId()), raters);
    }
}
