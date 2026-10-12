package com.VisionExpress.demo.repository;

import com.VisionExpress.demo.model.DoctorAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAppointmentRepository extends JpaRepository<DoctorAppointment, Long> {
    List<DoctorAppointment> findByDoctorId(Long doctorId);
    List<DoctorAppointment> findByMemberId(Long memberId);
}