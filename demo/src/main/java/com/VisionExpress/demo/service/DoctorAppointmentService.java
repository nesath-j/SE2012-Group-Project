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

        appointment.setStatus(
                DoctorAppointment.AppointmentStatus.SCHEDULED
        );
        return appointmentRepository.save(appointment);
    }
    public List<DoctorAppointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
    public List<DoctorAppointment> getAppointmentsByMember(Long memberId) {
        return appointmentRepository.findByMemberId(memberId);
    }


    @Transactional
    public DoctorAppointment updateConsultationNotes(Long appointmentId, String notes) {
        DoctorAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setConsultationNotes(notes);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public DoctorAppointment updateStatus(
            Long appointmentId,
            DoctorAppointment.AppointmentStatus status) {

        if (status == null) {
            throw new IllegalArgumentException(
                    "Appointment status cannot be null.");
        }

        DoctorAppointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Appointment not found."));

        if (status == DoctorAppointment.AppointmentStatus.CANCELLED) {
            cancelAppointment(appointmentId);
            return appointmentRepository.findById(appointmentId)
                    .orElseThrow();
        }

        if (appointment.getStatus() == DoctorAppointment.AppointmentStatus.CANCELLED) {
            throw new IllegalStateException(
                    "Cancelled appointments cannot be updated.");
        }

        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }



    @Transactional
    public boolean cancelAppointment(Long appointmentId) {

        return appointmentRepository.findById(appointmentId)
                .map(appointment -> {

                    if (appointment.getStatus() ==
                            DoctorAppointment.AppointmentStatus.CANCELLED) {
                        return false;
                    }

                    if (appointment.getStatus() ==
                            DoctorAppointment.AppointmentStatus.COMPLETED) {
                        throw new IllegalStateException(
                                "Completed appointments cannot be cancelled.");
                    }

                    scheduleRepository.findById(appointment.getScheduleId())
                            .ifPresent(schedule -> {
                                schedule.setBooked(false);
                                scheduleRepository.save(schedule);
                            });

                    appointment.setStatus(
                            DoctorAppointment.AppointmentStatus.CANCELLED
                    );

                    appointmentRepository.save(appointment);

                    return true;
                })
                .orElse(false);
    }

}
