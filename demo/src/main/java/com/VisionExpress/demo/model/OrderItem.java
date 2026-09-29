package com.VisionExpress.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    private int quantity;
    private double unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", columnDefinition = "BIGINT")
    private Order order;

    public OrderItem() {}

    public double getSubTotal() {
        return this.quantity * this.unitPrice;
    }

    public Long getOrderItemId() {return orderItemId; }
    public void setOrderItemId(Long orderItemId) {this.orderItemId = orderItemId; }

    public int getQuantity() {return quantity; }
    public void setQuantity(int quantity) {this.quantity = quantity; }

    public double getUnitPrice() {return unitPrice; }
    public void setUnitPrice(double unitPrice) {this.unitPrice = unitPrice; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
