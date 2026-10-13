package com.VisionExpress.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "members")
@PrimaryKeyJoinColumn(name = "user_id")
public class Member extends User {

    @Column(name = "loyalty_points", nullable = false)
    private int loyaltyPoints = 0;

    @Column(name = "total_earned_points", nullable = false)
    private int totalEarnedPoints = 0;

    @Column(name = "prescription_doc_path", length = 255)
    private String prescriptionPath;

    // Default constructor required by JPA
    public Member() {
        super();
    }

    // Getters and Setters

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public int getTotalEarnedPoints() {
        return totalEarnedPoints;
    }

    public void setTotalEarnedPoints(int totalEarnedPoints) {
        this.totalEarnedPoints = totalEarnedPoints;
    }

    public String getPrescriptionPath() {
        return prescriptionPath;
    }

    public void setPrescriptionPath(String prescriptionPath) {
        this.prescriptionPath = prescriptionPath;
    }

    // View currently available loyalty points
    public int viewLoyaltyPoints() {
        return loyaltyPoints;
    }

    // Store prescription file reference
    public void uploadPrescription(String filePath) {
        this.prescriptionPath = filePath;
    }
}
