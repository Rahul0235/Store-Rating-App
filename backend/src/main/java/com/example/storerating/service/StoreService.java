package com.example.storerating.service;

import com.example.storerating.dto.StoreResponse;
import com.example.storerating.dto.UserStoreResponse;
import com.example.storerating.model.Rating;
import com.example.storerating.model.Store;
import com.example.storerating.model.User;
import com.example.storerating.repository.RatingRepository;
import com.example.storerating.repository.StoreRepository;
import com.example.storerating.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StoreService {

    private final StoreRepository storeRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    public StoreService(StoreRepository storeRepository, RatingRepository ratingRepository,
                        UserRepository userRepository) {
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserStoreResponse> listForUser(Long userId, String name, String address) {
        List<StoreResponse> stores = storeRepository.search(
                name == null ? "" : name.trim(), "", address == null ? "" : address.trim());

        Map<Long, Integer> myRatings = ratingRepository.findByUserId(userId).stream()
                .collect(Collectors.toMap(r -> r.getStore().getId(), Rating::getScore));

        return stores.stream()
                .map(s -> new UserStoreResponse(s.id(), s.name(), s.address(), s.rating(), myRatings.get(s.id())))
                .toList();
    }

    @Transactional
    public void rateStore(Long userId, Long storeId, int score) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        Rating rating = ratingRepository.findByUserIdAndStoreId(userId, storeId).orElseGet(() -> {
            Rating created = new Rating();
            created.setUser(userRepository.getReferenceById(userId));
            created.setStore(store);
            return created;
        });

        rating.setScore(score);
        ratingRepository.save(rating);
    }
}
