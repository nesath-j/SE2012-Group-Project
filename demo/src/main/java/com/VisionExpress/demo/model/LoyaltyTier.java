package com.VisionExpress.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "loyalty_tiers")
public class LoyaltyTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tier_id")
    private int tierId;

    @Column(name = "tier_name", nullable = false,
            unique = true, length = 20)
    private String tierName;

    @Column(name = "min_points", nullable = false)
    private int minPoints;

    @Column(name = "discount_percentage", nullable = false)
    private double discountPercentage;

    // Default constructor required by JPA
    public LoyaltyTier() {
    }

    // Getters and Setters

    public int getTierId() {
        return tierId;
    }

    public void setTierId(int tierId) {
        this.tierId = tierId;
    }

    public String getTierName() {
        return tierName;
    }

    public void setTierName(String tierName) {
        this.tierName = tierName;
    }

    public int getMinPoints() {
        return minPoints;
    }

    public void setMinPoints(int minPoints) {
        this.minPoints = minPoints;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    // Calculate the discount for an eligible member
    public double calculateTierDiscount(int points) {

        if (points < minPoints) {
            return 0.0;
        }

        return discountPercentage;
    }
}
