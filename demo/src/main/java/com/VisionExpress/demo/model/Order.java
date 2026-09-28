package com.VisionExpress.demo.model;

import java.util.Date;

public class Order {
    private Long orderId;

    private Date orderDate;
    private double totalAmount;
    private double discountAmount;
    private String orderStatus;

    public Order() {}

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
}
