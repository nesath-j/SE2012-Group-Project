package com.VisionExpress.demo.model;

import java.util.Date;

public class Delivery {
    private Long deliveryId;

    private String trackingNo;
    private String deliveryStatus;
    private Date dispatchDate;
    private Date estimatedDeliveryDate;

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
}
