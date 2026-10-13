package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.ServiceAppointment;
import com.VisionExpress.demo.repository.ServiceAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class ServiceAppointmentService {

    private final ServiceAppointmentRepository serviceAppointmentRepository;

    private static final List<String> VALID_SERVICES = Arrays.asList("Frame Adjustment", "Lens Fitting", "Repair");
    private static final List<String> VALID_STATUSES = Arrays.asList("In-Progress", "Scheduled", "Completed", "Cancelled");
    private static final int MAX_DAILY_SLOTS = 10;

    @Autowired
    public ServiceAppointmentService(ServiceAppointmentRepository serviceAppointmentRepository) {
        this.serviceAppointmentRepository = serviceAppointmentRepository;
    }

    // Booking Flow: In-Progress (verification) -> Scheduled (confirmed)
    public ServiceAppointment bookAppointment(ServiceAppointment appointment) {
        if (!VALID_SERVICES.contains(appointment.getServiceType())) {
            throw new IllegalArgumentException("Invalid service type. Must be Frame Adjustment, Lens Fitting, or Repair.");
        }

        if (appointment.getAppointmentDate() == null) {
            throw new IllegalArgumentException("Appointment date and time must be provided.");
        }

        if (!appointment.getAppointmentDate().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Cannot book a service appointment in the past.");
        }

        // Step 1: Set status to In-Progress for slot verification
        appointment.setServiceStatus("In-Progress");

        // Step 2: Check daily slot capacity
        LocalDate date = appointment.getAppointmentDate().toLocalDate();
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        long activeCount = serviceAppointmentRepository.countActiveAppointmentsOnDate(startOfDay, endOfDay);
        if (activeCount >= MAX_DAILY_SLOTS) {
            throw new IllegalStateException("Slot unavailable: Daily appointment limit reached for this date.");
        }

        // Step 3: Automatically set to Scheduled once slot is confirmed
        appointment.setServiceStatus("Scheduled");
        return serviceAppointmentRepository.save(appointment);
    }

    public List<ServiceAppointment> getAllAppointments() {
        return serviceAppointmentRepository.findAll();
    }

    public ServiceAppointment getAppointmentById(Integer id) {
        return serviceAppointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
    }

    public List<ServiceAppointment> getAppointmentsByMember(Long memberId) {
        return serviceAppointmentRepository.findByMemberId(memberId);
    }

    public List<ServiceAppointment> getAppointmentsByEmployee(Long employeeId) {
        return serviceAppointmentRepository.findByEmployeeId(employeeId);
    }

    // Completion Flow: Scheduled -> Completed (Employee action)
    public ServiceAppointment completeAppointment(Integer id) {
        ServiceAppointment appointment = getAppointmentById(id);
        if (!"Scheduled".equals(appointment.getServiceStatus())) {
            throw new IllegalStateException("Only Scheduled appointments can be marked as completed.");
        }
        appointment.setServiceStatus("Completed");
        return serviceAppointmentRepository.save(appointment);
    }

    // Cancellation Flow: Member or Employee can cancel
    public ServiceAppointment cancelAppointment(Integer id) {
        ServiceAppointment appointment = getAppointmentById(id);
        if ("Completed".equals(appointment.getServiceStatus())) {
            throw new IllegalStateException("Cannot cancel a completed appointment.");
        }
        if ("Cancelled".equals(appointment.getServiceStatus())) {
            throw new IllegalStateException("Appointment is already cancelled.");
        }
        appointment.setServiceStatus("Cancelled");
        return serviceAppointmentRepository.save(appointment);
    }


    public ServiceAppointment updateStatus(Integer id, String newStatus) {

        if (!VALID_STATUSES.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status value.");
        }

        ServiceAppointment appointment = getAppointmentById(id);

        String currentStatus = appointment.getServiceStatus();

        if ("Completed".equals(currentStatus) ||
                "Cancelled".equals(currentStatus)) {
            throw new IllegalStateException(
                    "Completed or cancelled appointments cannot be updated.");
        }

        if ("Completed".equals(newStatus)) {
            return completeAppointment(id);
        }

        if ("Cancelled".equals(newStatus)) {
            return cancelAppointment(id);
        }

        if (!currentStatus.equals(newStatus)) {
            throw new IllegalStateException(
                    "This status change is not allowed.");
        }

        return appointment;
    }

    public List<String> getAvailableServices() {
        return List.copyOf(VALID_SERVICES);
    }
}
