package com.VisionExpress.controller;

import com.VisionExpress.model.Cart;
import com.VisionExpress.model.Delivery;
import com.VisionExpress.model.Order;
import com.VisionExpress.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    // PUT /api/members/{memberId}/prescription
    @PutMapping("/{memberId}/prescription")
    public ResponseEntity<String> uploadPrescription(@PathVariable int memberId, @RequestParam String filePath) {
        memberService.uploadPrescription(memberId, filePath);
        return ResponseEntity.ok("Prescription document path updated successfully.");
    }

    // GET /api/members/{memberId}/loyalty-points
    @GetMapping("/{memberId}/loyalty-points")
    public ResponseEntity<Integer> viewLoyaltyPoints(@PathVariable int memberId) {
        return ResponseEntity.ok(memberService.viewLoyaltyPoints(memberId));
    }

    // POST /api/members/{memberId}/redeem-points?points=200
    @PostMapping("/{memberId}/redeem-points")
    public ResponseEntity<String> redeemPoints(@PathVariable int memberId, @RequestParam int points) {
        double discount = memberService.redeemPoints(memberId, points);
        return ResponseEntity.ok("Redemption successful. Discount value: $" + discount);
    }

    // POST /api/members/{memberId}/orders
    @PostMapping("/{memberId}/orders")
    public ResponseEntity<Order> placeOrder(@PathVariable int memberId, @RequestBody Cart cart) {
        return new ResponseEntity<>(memberService.placeOrder(memberId, cart), HttpStatus.CREATED);
    }

    // GET /api/members/orders/{orderId}/track
    @GetMapping("/orders/{orderId}/track")
    public ResponseEntity<Delivery> trackOrder(@PathVariable int orderId) {
        return ResponseEntity.ok(memberService.trackOrder(orderId));
    }
}
