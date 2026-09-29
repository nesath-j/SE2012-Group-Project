package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.DoctorAppointment;
import com.VisionExpress.demo.model.DoctorSchedule;
import com.VisionExpress.demo.repository.DoctorAppointmentRepository;
import com.VisionExpress.demo.repository.DoctorScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorAppointmentService {

    private final DoctorAppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository scheduleRepository;

    public DoctorAppointmentService(DoctorAppointmentRepository appointmentRepository,
                                    DoctorScheduleRepository scheduleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.scheduleRepository = scheduleRepository;
    }

    @Transactional
    public DoctorAppointment bookAppointment(DoctorAppointment appointment) {
        DoctorSchedule schedule = scheduleRepository.findById(appointment.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule slot not found"));

        if (schedule.isBooked()) {
            throw new RuntimeException("Schedule slot is already booked");
        }

        schedule.setBooked(true);
        scheduleRepository.save(schedule);

        appointment.setStatus("SCHEDULED");
        return appointmentRepository.save(appointment);
    }
    public List<DoctorAppointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
    public List<DoctorAppointment> getAppointmentsByMember(Long memberId) {
        return appointmentRepository.findByMemberId(memberId);
    }



    public DoctorAppointment updateConsultationNotes(Long appointmentId, String notes) {
        DoctorAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setConsultationNotes(notes);
        return appointmentRepository.save(appointment);
    }

    public DoctorAppointment updateStatus(Long appointmentId, String status) {
        DoctorAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }
}