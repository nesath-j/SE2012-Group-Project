package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.ServiceAppointment;
import com.VisionExpress.demo.repository.ServiceAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ServiceAppointmentService {

    private final ServiceAppointmentRepository serviceAppointmentRepository;

    private static final List<String> VALID_SERVICES = Arrays.asList("Frame Adjustment", "Lens Fitting", "Repair");
    private static final List<String> VALID_STATUSES = Arrays.asList("Scheduled", "In-Progress", "Completed", "Cancelled");

    @Autowired
    public ServiceAppointmentService(ServiceAppointmentRepository serviceAppointmentRepository) {
        this.serviceAppointmentRepository = serviceAppointmentRepository;
    }

    public ServiceAppointment bookAppointment(ServiceAppointment appointment) {
        if (!VALID_SERVICES.contains(appointment.getServiceType())) {
            throw new IllegalArgumentException("Invalid service type. Must be Frame Adjustment, Lens Fitting, or Repair.");
        }
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

    public List<ServiceAppointment> getAppointmentsByMember(Integer memberId) {
        return serviceAppointmentRepository.findByMemberId(memberId);
    }

    public List<ServiceAppointment> getAppointmentsByEmployee(Integer employeeId) {
        return serviceAppointmentRepository.findByEmployeeId(employeeId);
    }

    public ServiceAppointment updateStatus(Integer id, String newStatus) {
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status value.");
        }
        ServiceAppointment appointment = getAppointmentById(id);
        appointment.setServiceStatus(newStatus);
        return serviceAppointmentRepository.save(appointment);
    }

    public ServiceAppointment cancelAppointment(Integer id) {
        return updateStatus(id, "Cancelled");
    }
}