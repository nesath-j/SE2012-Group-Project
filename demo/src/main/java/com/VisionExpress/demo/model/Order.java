package com.VisionExpress.demo.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private Date orderDate;
    private double totalAmount;
    private double discountAmount;
    private String orderStatus;
    private boolean prescriptionAttached;

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

    public Date getOrderDate() {return orderDate; }
    public void setOrderDate(Date orderDate) {this.orderDate = orderDate; }

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
}
