package com.example.storerating.repository;

import com.example.storerating.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndStoreId(Long userId, Long storeId);

    List<Rating> findByUserId(Long userId);

    @Query("select r from Rating r join fetch r.user where r.store.id = :storeId order by r.user.name")
    List<Rating> findByStoreWithUser(@Param("storeId") Long storeId);

    @Query("select avg(r.score) from Rating r where r.store.id = :storeId")
    Double averageForStore(@Param("storeId") Long storeId);
}
