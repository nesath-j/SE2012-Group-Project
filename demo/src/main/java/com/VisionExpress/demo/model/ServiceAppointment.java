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
    private Integer memberId;

    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @Column(name = "service_type", nullable = false, length = 100)
    private String serviceType;

    @Column(name = "appointment_date", nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "service_status", nullable = false, length = 50)
    private String serviceStatus;

    public Integer getServiceAppointmentId() {
        return serviceAppointmentId;
    }

    public void setServiceAppointmentId(Integer serviceAppointmentId) {
        this.serviceAppointmentId = serviceAppointmentId;
    }

    public Integer getMemberId() {
        return memberId;
    }

    public void setMemberId(Integer memberId) {
        this.memberId = memberId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
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
