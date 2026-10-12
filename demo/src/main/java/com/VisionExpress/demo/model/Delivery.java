package com.VisionExpress.demo.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_id")
    private Long deliveryId;

    @Column(name = "tracking_no")
    private String trackingNo;
    @Column(name = "delivery_status")
    private String deliveryStatus;
    @Column(name = "dispatch_date")
    private Date dispatchDate;
    @Column(name = "estimated_delivery_date")
    private Date estimatedDeliveryDate;

    @Column(name = "order_id")
    private Long orderId;
    @Column(name = "courier_id")
    private Long courierId;

    // 1. Updates delivery status
    public void updateStatus(String status) {
        this.deliveryStatus = status;
    }

    // 2. Returns formatted tracking information
    public String getTrackingDetails() {
        return "Tracking No: " + this.trackingNo + " | Status: " + this.deliveryStatus +
                " | Estimated Delivery: " + (this.estimatedDeliveryDate != null ? this.estimatedDeliveryDate.toString() : "N/A");
    }

    public Delivery() {}

    public Long getDeliveryId() {return deliveryId; }
    public void setDeliveryId(Long deliveryId) {this.deliveryId = deliveryId; }

    public String getTrackingNo() {return trackingNo; }
    public void setTrackingNo(String trackingNo) {this.trackingNo = trackingNo; }

    public String getDeliveryStatus() {return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) {this.deliveryStatus = deliveryStatus; }

    public Date getDispatchDate() {return dispatchDate; }
    public void setDispatchDate(Date dispatchDate) {this.dispatchDate = dispatchDate; }

    public Date getEstimatedDeliveryDate() {return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(Date estimatedDeliveryDate) {this.estimatedDeliveryDate = estimatedDeliveryDate; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getCourierId() { return courierId; }
    public void setCourierId(Long courierId) { this.courierId = courierId; }
}
