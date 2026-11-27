package com.example.storerating.service;

import com.example.storerating.dto.*;
import com.example.storerating.model.Role;
import com.example.storerating.model.Store;
import com.example.storerating.model.User;
import com.example.storerating.repository.RatingRepository;
import com.example.storerating.repository.StoreRepository;
import com.example.storerating.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final RatingRepository ratingRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, StoreRepository storeRepository,
                        RatingRepository ratingRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
        this.ratingRepository = ratingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public StatsResponse getStats() {
        return new StatsResponse(userRepository.count(), storeRepository.count(), ratingRepository.count());
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setAddress(request.address().trim());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers(String name, String email, String address, Role role) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.hasText(name)) {
                predicates.add(cb.like(cb.lower(root.get("name")), like(name)));
            }
            if (StringUtils.hasText(email)) {
                predicates.add(cb.like(cb.lower(root.get("email")), like(email)));
            }
            if (StringUtils.hasText(address)) {
                predicates.add(cb.like(cb.lower(root.get("address")), like(address)));
            }
            if (role != null) {
                predicates.add(cb.equal(root.get("role"), role));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, Sort.by("name")).stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Double rating = null;
        if (user.getRole() == Role.STORE_OWNER) {
            rating = storeRepository.findByOwnerId(user.getId())
                    .map(store -> ratingRepository.averageForStore(store.getId()))
                    .orElse(null);
        }
        return UserResponse.from(user, rating);
    }

    @Transactional
    public StoreResponse createStore(StoreRequest request) {
        String email = request.email().trim().toLowerCase();
        if (storeRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A store with this email already exists");
        }

        Store store = new Store();
        store.setName(request.name().trim());
        store.setEmail(email);
        store.setAddress(request.address().trim());

        if (StringUtils.hasText(request.ownerEmail())) {
            User owner = userRepository.findByEmail(request.ownerEmail().trim().toLowerCase())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));
            if (owner.getRole() != Role.STORE_OWNER) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That user is not a store owner");
            }
            if (storeRepository.existsByOwnerId(owner.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This owner already has a store");
            }
            store.setOwner(owner);
        }

        Store saved = storeRepository.save(store);
        return new StoreResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getAddress(), null, 0L);
    }

    @Transactional(readOnly = true)
    public List<StoreResponse> listStores(String name, String email, String address) {
        return storeRepository.search(nullToEmpty(name), nullToEmpty(email), nullToEmpty(address));
    }

    private String like(String value) {
        return "%" + value.trim().toLowerCase() + "%";
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}
