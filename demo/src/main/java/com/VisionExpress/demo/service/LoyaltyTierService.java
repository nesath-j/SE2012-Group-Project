package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.LoyaltyTier;
import com.VisionExpress.demo.model.Member;
import com.VisionExpress.demo.repository.LoyaltyTierRepository;
import com.VisionExpress.demo.repository.MemberRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyTierService {

    private final LoyaltyTierRepository loyaltyTierRepository;
    private final MemberRepository memberRepository;

    // Default constructor injection
    public LoyaltyTierService(
            LoyaltyTierRepository loyaltyTierRepository,
            MemberRepository memberRepository) {

        this.loyaltyTierRepository = loyaltyTierRepository;
        this.memberRepository = memberRepository;
    }

    // 1. Get all available loyalty tiers
    public List<LoyaltyTier> getAllTiers() {
        return loyaltyTierRepository.findAll();
    }

    // 2. Find a tier by its name
    public LoyaltyTier getTierByName(String tierName) {

        return loyaltyTierRepository.findByTierName(tierName)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Loyalty tier not found: " + tierName));
    }

    // 3. Determine tier using lifetime earned points
    public LoyaltyTier calculateTier(int points) {

        if (points < 0) {
            throw new IllegalArgumentException(
                    "Points cannot be negative.");
        }

        return loyaltyTierRepository
                .findFirstByMinPointsLessThanEqualOrderByMinPointsDesc(points)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "No eligible loyalty tier found."));
    }

    // 4. Get a member's current loyalty tier
    public LoyaltyTier getMemberTier(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found: " + memberId));

        return calculateTier(member.getTotalEarnedPoints());
    }

    // 5. Calculate the member's discount percentage
    public double calculateTierDiscount(int points) {

        LoyaltyTier tier = calculateTier(points);

        return tier.calculateTierDiscount(points);
    }

    // 6. Get the discount percentage for a member
    public double getMemberDiscount(Long memberId) {

        LoyaltyTier tier = getMemberTier(memberId);

        return tier.getDiscountPercentage();
    }
}

