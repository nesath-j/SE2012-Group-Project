package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.ServiceAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceAppointmentRepository extends JpaRepository<ServiceAppointment, Integer> {

    List<ServiceAppointment> findByMemberId(Integer memberId);

    List<ServiceAppointment> findByEmployeeId(Integer employeeId);

    List<ServiceAppointment> findByServiceStatus(String serviceStatus);
}