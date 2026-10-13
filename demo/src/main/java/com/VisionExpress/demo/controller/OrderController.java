package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Order;
import com.VisionExpress.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserRepository userRepository;


    // POST /api/orders - Create order
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody Order order,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in to place an order.");
        }

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElse(null);

        if (currentUser == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found.");
        }

        if (!"MEMBER".equalsIgnoreCase(currentUser.getUserType())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only Members can place orders.");
        }

        // Use the authenticated Member ID, not the ID sent by React
        order.setMemberId(currentUser.getUserId());

        try {
            Order savedOrder = orderService.createOrder(order);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedOrder);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // GET /api/orders - Retrieve all orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // GET /api/orders/{id} - Retrieve order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH /api/orders/{id}/status - Update status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        boolean updated = orderService.updateOrderStatus(id, status);
        if (updated) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // PATCH /api/orders/{id}/discount - Apply discount
    @PatchMapping("/{id}/discount")
    public ResponseEntity<Order> applyDiscount(@PathVariable Long id, @RequestParam double discount) {
        return orderService.applyDiscount(id, discount)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // POST /api/orders/{orderId}/payment-slip
    @PostMapping("/{orderId}/payment-slip")
    public ResponseEntity<?> uploadPaymentSlip(
            @PathVariable Long orderId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElse(null);

        if (currentUser == null ||
                !"MEMBER".equalsIgnoreCase(currentUser.getUserType())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only Members can upload payment slips.");
        }

        Order order = orderService.getOrderById(orderId)
                .orElse(null);

        if (order == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Order not found.");
        }

        if (!currentUser.getUserId().equals(order.getMemberId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You can only upload payment slips for your own orders.");
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Please select a payment slip.");
        }

        if (order.getPaymentStatus() != Order.PaymentStatus.PENDING
                && order.getPaymentStatus() != Order.PaymentStatus.REJECTED) {
            return ResponseEntity
                    .badRequest()
                    .body("A payment slip cannot be uploaded in the current payment status.");
        }

        try {
            Order updatedOrder = orderService.uploadPaymentSlip(orderId, file);

            return ResponseEntity.ok(
                    "Payment slip uploaded successfully for order "
                            + updatedOrder.getOrderId()
            );

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body("Payment slip upload failed.");
        }
    }

    // PATCH /api/orders/{orderId}/confirm-payment
    @PatchMapping("/{orderId}/confirm-payment")
    public ResponseEntity<String> confirmPayment(
            @PathVariable Long orderId) {

        try {
            orderService.confirmPayment(orderId);

            return ResponseEntity.ok(
                    "Payment confirmed and loyalty points processed successfully."
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // GET /api/orders/my-orders - View logged-in Member's orders
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        User currentUser = userRepository
                .findByEmail(authentication.getName())
                .orElse(null);

        if (currentUser == null ||
                !"MEMBER".equalsIgnoreCase(currentUser.getUserType())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Only Members can view their order history.");
        }

        return ResponseEntity.ok(
                orderService.getOrdersByMemberId(currentUser.getUserId())
        );
    }

}

