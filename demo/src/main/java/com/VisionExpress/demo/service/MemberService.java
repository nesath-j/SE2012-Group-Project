package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Member;
import com.VisionExpress.demo.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    // Proposed loyalty rules
    private static final int RUPEES_PER_POINT = 100;
    private static final double REDEMPTION_VALUE = 1.0;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 1. View available loyalty points
    public int viewLoyaltyPoints(int memberId) {

        Member member = getMember(memberId);

        return member.getLoyaltyPoints();
    }

    // 2. View lifetime earned points
    public int getTotalEarnedPoints(int memberId) {

        Member member = getMember(memberId);

        return member.getTotalEarnedPoints();
    }

    // 3. Earn points after a completed purchase
    @Transactional
    public void earnPoints(int memberId, double purchaseAmount) {

        if (!Double.isFinite(purchaseAmount)
                || purchaseAmount <= 0) {
            throw new IllegalArgumentException(
                    "Purchase amount must be positive.");
        }

        Member member = getMember(memberId);

        int earnedPoints =
                (int) Math.floor(
                        purchaseAmount / RUPEES_PER_POINT);

        member.setLoyaltyPoints(
                Math.addExact(member.getLoyaltyPoints(),
                        earnedPoints));

        member.setTotalEarnedPoints(
                Math.addExact(member.getTotalEarnedPoints(),
                        earnedPoints));

        memberRepository.save(member);
    }

    // 4. Calculate point redemption value
    public double redeemPoints(int memberId, int points) {

        Member member = getMember(memberId);

        if (points <= 0) {
            throw new IllegalArgumentException(
                    "Points must be greater than zero.");
        }

        if (points > member.getLoyaltyPoints()) {
            throw new IllegalArgumentException(
                    "Insufficient loyalty points.");
        }

        return points * REDEMPTION_VALUE;
    }

    // 5. Deduct points when an order is confirmed
    @Transactional
    public void confirmRedemption(int memberId, int points) {

        if (points <= 0) {
            throw new IllegalArgumentException(
                    "Points must be greater than zero.");
        }

        Member member = getMember(memberId);

        if (points > member.getLoyaltyPoints()) {
            throw new IllegalArgumentException(
                    "Insufficient loyalty points.");
        }

        member.setLoyaltyPoints(
                member.getLoyaltyPoints() - points);

        // Total earned points remain unchanged
        memberRepository.save(member);
    }

    // 6. Determine the loyalty tier
    public String getLoyaltyTier(int memberId) {

        Member member = getMember(memberId);
        int totalPoints = member.getTotalEarnedPoints();

        if (totalPoints >= 3000) {
            return "Platinum";
        } else if (totalPoints >= 1500) {
            return "Gold";
        } else if (totalPoints >= 500) {
            return "Silver";
        }

        return "Bronze";
    }

    // 7. Get the tier discount percentage
    public double getTierDiscount(int memberId) {

        String tier = getLoyaltyTier(memberId);

        switch (tier) {
            case "Platinum":
                return 15.0;
            case "Gold":
                return 10.0;
            case "Silver":
                return 5.0;
            default:
                return 0.0;
        }
    }

    // 8. Store a prescription file reference
    @Transactional
    public void uploadPrescription(
            int memberId, String filePath) {

        if (filePath == null || filePath.isBlank()
                || filePath.length() > 255) {
            throw new IllegalArgumentException(
                    "Invalid prescription file reference.");
        }

        Member member = getMember(memberId);

        member.setPrescriptionPath(filePath);
        memberRepository.save(member);
    }

    // Helper method to find a member
    private Member getMember(int memberId) {

        return memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Member not found: " + memberId));
    }
}
