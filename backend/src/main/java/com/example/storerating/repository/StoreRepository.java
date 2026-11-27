package com.example.storerating.repository;

import com.example.storerating.dto.StoreResponse;
import com.example.storerating.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {

    boolean existsByEmail(String email);

    boolean existsByOwnerId(Long ownerId);

    Optional<Store> findByOwnerId(Long ownerId);

    @Query("""
            select new com.example.storerating.dto.StoreResponse(
                s.id, s.name, s.email, s.address, avg(r.score), count(r))
            from Store s left join s.ratings r
            where lower(s.name) like lower(concat('%', :name, '%'))
              and lower(s.email) like lower(concat('%', :email, '%'))
              and lower(s.address) like lower(concat('%', :address, '%'))
            group by s.id, s.name, s.email, s.address
            order by s.name
            """)
    List<StoreResponse> search(@Param("name") String name,
                               @Param("email") String email,
                               @Param("address") String address);
}
