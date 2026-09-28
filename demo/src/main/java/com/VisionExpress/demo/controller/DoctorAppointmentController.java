package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.DoctorAppointment;
import com.VisionExpress.demo.service.DoctorAppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class DoctorAppointmentController {

    private final DoctorAppointmentService appointmentService;

    public DoctorAppointmentController(DoctorAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/book")
    public DoctorAppointment bookAppointment(@RequestBody DoctorAppointment appointment) {
        return appointmentService.bookAppointment(appointment);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<DoctorAppointment> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return appointmentService.getAppointmentsByDoctor(doctorId);
    }

    @PutMapping("/{id}/notes")
    public DoctorAppointment updateNotes(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return appointmentService.updateConsultationNotes(id, payload.get("notes"));
    }

    @PutMapping("/{id}/status")
    public DoctorAppointment updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return appointmentService.updateStatus(id, payload.get("status"));
    }
}