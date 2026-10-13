package com.VisionExpress.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "Doctor")
@PrimaryKeyJoinColumn(
        name = "doctor_id",
        referencedColumnName = "user_id"
)
public class Doctor extends User {

    @Column(name = "specialization", nullable = false)
    private String specialization;

    @Column(name = "license_number", nullable = false)
    private String licenseNumber;

    // Default constructor required by JPA
    public Doctor() {
        super();
    }

    // Doctor ID uses the inherited User ID
    public Long getDoctorId() {
        return getUserId();
    }

    // Getters and Setters

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
}
