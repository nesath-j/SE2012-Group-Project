package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.ServiceAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ServiceAppointmentRepository extends JpaRepository<ServiceAppointment, Integer> {

    List<ServiceAppointment> findByMemberId(Long memberId);

    List<ServiceAppointment> findByEmployeeId(Long employeeId);

    List<ServiceAppointment> findByServiceStatus(String serviceStatus);

    // Verifies daily slot availability capacity
    @Query("SELECT COUNT(s) FROM ServiceAppointment s WHERE s.appointmentDate BETWEEN :start AND :end AND s.serviceStatus != 'Cancelled'")
    long countActiveAppointmentsOnDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT DISTINCT s.serviceType FROM ServiceAppointment s ORDER BY s.serviceType")
    List<String> findDistinctServiceTypes();
}
