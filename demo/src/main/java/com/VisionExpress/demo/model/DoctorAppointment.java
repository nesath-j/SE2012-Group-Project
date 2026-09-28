package com.VisionExpress.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_appointment")
public class DoctorAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_appointment_id")
    private Long doctorAppointmentId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "doctor_id", nullable = false)
    private Long doctorId;

    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "consultation_notes", columnDefinition = "TEXT")
    private String consultationNotes;

    // Getters and Setters
    public Long getDoctorAppointmentId() {
        return doctorAppointmentId;
    }

    public void setDoctorAppointmentId(Long doctorAppointmentId) {
        this.doctorAppointmentId = doctorAppointmentId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getConsultationNotes() {
        return consultationNotes;
    }

    public void setConsultationNotes(String consultationNotes) {
        this.consultationNotes = consultationNotes;
    }
}