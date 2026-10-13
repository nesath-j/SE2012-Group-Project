package com.VisionExpress.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "SERVICE_APPOINTMENT")
public class ServiceAppointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_appointment_id")
    private Integer serviceAppointmentId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "service_type", nullable = false, length = 100)
    private String serviceType;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "service_status", nullable = false, length = 50)
    private String serviceStatus;

    public ServiceAppointment() {
    }

    public Integer getServiceAppointmentId() {
        return serviceAppointmentId;
    }

    public void setServiceAppointmentId(Integer serviceAppointmentId) {
        this.serviceAppointmentId = serviceAppointmentId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getServiceStatus() {
        return serviceStatus;
    }

    public void setServiceStatus(String serviceStatus) {
        this.serviceStatus = serviceStatus;
    }
}
