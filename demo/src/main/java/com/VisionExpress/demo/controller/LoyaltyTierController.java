package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.LoyaltyTier;
import com.VisionExpress.demo.service.LoyaltyTierService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loyalty-tiers")
public class LoyaltyTierController {

    private final LoyaltyTierService loyaltyTierService;

    // Constructor injection
    public LoyaltyTierController(
            LoyaltyTierService loyaltyTierService) {

        this.loyaltyTierService = loyaltyTierService;
    }

    // 1. View all loyalty tiers
    @GetMapping
    public ResponseEntity<List<LoyaltyTier>> getAllTiers() {

        List<LoyaltyTier> tiers =
                loyaltyTierService.getAllTiers();

        return ResponseEntity.ok(tiers);
    }

    // 2. Search for a tier by name
    @GetMapping("/name/{tierName}")
    public ResponseEntity<?> getTierByName(
            @PathVariable String tierName) {

        try {
            LoyaltyTier tier =
                    loyaltyTierService.getTierByName(tierName);

            return ResponseEntity.ok(tier);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 3. Find tier based on earned points
    @GetMapping("/calculate")
    public ResponseEntity<?> calculateTier(
            @RequestParam int points) {

        try {
            LoyaltyTier tier =
                    loyaltyTierService.calculateTier(points);

            return ResponseEntity.ok(tier);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 4. View a member's loyalty tier
    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> getMemberTier(
            @PathVariable Long memberId) {

        try {
            LoyaltyTier tier =
                    loyaltyTierService.getMemberTier(memberId);

            return ResponseEntity.ok(tier);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 5. Calculate discount percentage from points
    @GetMapping("/discount")
    public ResponseEntity<?> calculateTierDiscount(
            @RequestParam int points) {

        try {
            double discount =
                    loyaltyTierService.calculateTierDiscount(
                            points);

            return ResponseEntity.ok(
                    Map.of("discountPercentage", discount));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 6. View a member's discount percentage
    @GetMapping("/member/{memberId}/discount")
    public ResponseEntity<?> getMemberDiscount(
            @PathVariable Long memberId) {

        try {
            double discount =
                    loyaltyTierService.getMemberDiscount(
                            memberId);

            return ResponseEntity.ok(
                    Map.of("discountPercentage", discount));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

