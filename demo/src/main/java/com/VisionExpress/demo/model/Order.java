package com.VisionExpress.demo.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_date")
    private LocalDateTime orderDate;
    @Column(name = "total_amount")
    private double totalAmount;
    @Column(name = "discount_amount")
    private double discountAmount;
    @Column(name = "order_status")
    private String orderStatus;
    @Column(name = "prescription_attached")
    private boolean prescriptionAttached;
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING; // Default state
    @Column(name = "payment_slip")
    private String paymentSlip;
    @Column(name = "member_id")
    private Long memberId;
    @Column(name = "loyalty_points_awarded", nullable = false)
    private boolean loyaltyPointsAwarded = false;

    public enum PaymentStatus {
        PENDING,
        TO_BE_CONFIRMED,
        CONFIRMED,
        REJECTED
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {}

    // 1. Calculates the net final total
    public double calculateFinalTotal() {
        double finalTotal = this.totalAmount - this.discountAmount;
        return Math.max(finalTotal, 0.0);
    }

    // 2. Applies loyalty discount amount
    public void applyLoyaltyDiscount(double discount) {
        this.discountAmount = discount;
    }

    // 3. Updates order status
    public void updateOrderStatus(String status) {
        this.orderStatus = status;
    }

    public Long getOrderId() {return orderId; }
    public void setOrderId(Long orderId) {this.orderId = orderId; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public double getTotalAmount() {return totalAmount; }
    public void setTotalAmount(double totalAmount) {this.totalAmount = totalAmount; }

    public double getDiscountAmount() {return discountAmount; }
    public void setDiscountAmount(double discountAmount) {this.discountAmount = discountAmount; }

    public String getOrderStatus() {return orderStatus; }
    public void setOrderStatus(String orderStatus) {this.orderStatus = orderStatus; }

    public boolean isPrescriptionAttached() {return prescriptionAttached; }
    public void setPrescriptionAttached(boolean prescriptionAttached) {this.prescriptionAttached = prescriptionAttached; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentSlip() { return paymentSlip; }
    public void setPaymentSlip(String paymentSlip) { this.paymentSlip = paymentSlip; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public boolean isLoyaltyPointsAwarded() { return loyaltyPointsAwarded; }
    public void setLoyaltyPointsAwarded(boolean loyaltyPointsAwarded) { this.loyaltyPointsAwarded = loyaltyPointsAwarded; }
}
