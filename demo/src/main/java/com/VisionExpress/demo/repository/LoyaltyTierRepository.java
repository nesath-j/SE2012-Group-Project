package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.LoyaltyTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoyaltyTierRepository extends JpaRepository<LoyaltyTier, Integer> {

    // Find a loyalty tier by its name
    Optional<LoyaltyTier> findByTierName(String tierName);

    // Find the highest tier a member qualifies for
    Optional<LoyaltyTier>
    findFirstByMinPointsLessThanEqualOrderByMinPointsDesc(int points);
}
