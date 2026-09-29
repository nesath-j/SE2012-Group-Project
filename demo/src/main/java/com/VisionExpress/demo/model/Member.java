package com.VisionExpress.model;

import com.VisionExpress.demo.model.LoyaltyTier;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "member")
@PrimaryKeyJoinColumn(name = "member_id")
public class Member extends com.VisionExpress.model.User {

    @Column(name = "loyalty_points", nullable = false)
    private int loyaltyPoints;

    @Column(name = "prescription_doc_path", length = 255)
    private String prescriptionPath;

    @ManyToOne
    @JoinColumn(name = "tier_id")
    private LoyaltyTier loyaltyTier;

    public Member() {
        super();
        setUserType("Member");
    }

    public int getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(int loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }

    public String getPrescriptionPath() { return prescriptionPath; }
    public void setPrescriptionPath(String prescriptionPath) { this.prescriptionPath = prescriptionPath; }

    public LoyaltyTier getLoyaltyTier() { return loyaltyTier; }
    public void setLoyaltyTier(LoyaltyTier loyaltyTier) { this.loyaltyTier = loyaltyTier; }
}