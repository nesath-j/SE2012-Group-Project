package com.VisionExpress.demo.model;

public class Member extends User {
    private int loyaltyPoints;
    private Integer tierId; // Nullable if no tier assigned initially
    private String prescriptionDocPath;

    // Getters and Setters
    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public Integer getTierId() {
        return tierId;
    }

    public void setTierId(Integer tierId) {
        this.tierId = tierId;
    }

    public String getPrescriptionDocPath() {
        return prescriptionDocPath;
    }

    public void setPrescriptionDocPath(String prescriptionDocPath) {
        this.prescriptionDocPath = prescriptionDocPath;
    }
}