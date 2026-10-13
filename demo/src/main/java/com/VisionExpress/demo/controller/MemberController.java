package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.service.MemberService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    // Constructor injection
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // 1. View available loyalty points
    @GetMapping("/{memberId}/points")
    public ResponseEntity<?> viewLoyaltyPoints(
            @PathVariable Long memberId) {

        try {
            int points = memberService.viewLoyaltyPoints(memberId);

            return ResponseEntity.ok(
                    Map.of("loyaltyPoints", points));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 2. View lifetime earned points
    @GetMapping("/{memberId}/total-points")
    public ResponseEntity<?> getTotalEarnedPoints(
            @PathVariable Long memberId) {

        try {
            int points = memberService.getTotalEarnedPoints(memberId);

            return ResponseEntity.ok(
                    Map.of("totalEarnedPoints", points));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 3. View current loyalty tier
    @GetMapping("/{memberId}/tier")
    public ResponseEntity<?> getLoyaltyTier(
            @PathVariable Long memberId) {

        try {
            String tier = memberService.getLoyaltyTier(memberId);

            return ResponseEntity.ok(
                    Map.of("tier", tier));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 4. View tier discount percentage
    @GetMapping("/{memberId}/discount")
    public ResponseEntity<?> getTierDiscount(
            @PathVariable Long memberId) {

        try {
            double discount = memberService.getTierDiscount(memberId);

            return ResponseEntity.ok(
                    Map.of("discountPercentage", discount));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 5. Preview point redemption
    @GetMapping("/{memberId}/redeem")
    public ResponseEntity<?> redeemPoints(
            @PathVariable Long memberId,
            @RequestParam int points) {

        try {
            double value = memberService.redeemPoints(
                    memberId, points);

            return ResponseEntity.ok(
                    Map.of("redemptionValue", value));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 6. Store prescription reference
    @PutMapping("/{memberId}/prescription")
    public ResponseEntity<?> uploadPrescription(
            @PathVariable Long memberId,
            @RequestBody Map<String, String> request) {

        try {
            String filePath = request.get("filePath");

            memberService.uploadPrescription(
                    memberId, filePath);

            return ResponseEntity.ok(
                    Map.of("message",
                            "Prescription reference updated."));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
