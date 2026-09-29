package com.VisionExpress.service;

import com.VisionExpress.demo.model.Cart;
import com.VisionExpress.model.Delivery;
import com.VisionExpress.model.LoyaltyTier;
import com.VisionExpress.model.Member;
import com.VisionExpress.model.Order;
import com.VisionExpress.repository.LoyaltyTierRepository;
import com.VisionExpress.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private LoyaltyTierRepository loyaltyTierRepository;

    // + uploadPrescription(filePath: String): void
    @Transactional
    public void uploadPrescription(int memberId, String filePath) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with ID: " + memberId));

        member.setPrescriptionPath(filePath);
        memberRepository.save(member);
    }

    // + viewLoyaltyPoints(): int
    public int viewLoyaltyPoints(int memberId) {
        return memberRepository.findById(memberId)
                .map(Member::getLoyaltyPoints)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with ID: " + memberId));
    }

    // + redeemPoints(points: int): double
    @Transactional
    public double redeemPoints(int memberId, int points) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with ID: " + memberId));

        if (points <= 0) {
            throw new IllegalArgumentException("Points to redeem must be greater than zero.");
        }
        if (member.getLoyaltyPoints() < points) {
            throw new IllegalStateException("Insufficient loyalty points balance.");
        }

        // Deduct points
        member.setLoyaltyPoints(member.getLoyaltyPoints() - points);

        // Re-evaluate tier status using repository lookup
        Optional<LoyaltyTier> matchingTier =
                loyaltyTierRepository.findFirstByMinPointsLessThanEqualOrderByMinPointsDesc(member.getLoyaltyPoints());
        matchingTier.ifPresent(member::setLoyaltyTier);

        memberRepository.save(member);

        // Convert points to monetary discount value (e.g., 100 points = $1.00)
        return points * 0.01;
    }

    // + placeOrder(cart: Cart): Order
    public Order placeOrder(int memberId, Cart cart) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found with ID: " + memberId));

        int newOrderId = (int) (System.currentTimeMillis() % 100000);
        double total = (cart != null) ? cart.getTotalAmount() : 0.0;

        return new Order(newOrderId, new Date(), total, "Placed");
    }

    // + trackOrder(orderId: int): Delivery
    public Delivery trackOrder(int orderId) {
        String trackingCode = "VX-TRK-" + orderId;
        Date estimatedArrival = new Date(System.currentTimeMillis() + (2L * 86400000L)); // +2 days

        return new Delivery(1, trackingCode, "In-Transit", estimatedArrival);
    }
}