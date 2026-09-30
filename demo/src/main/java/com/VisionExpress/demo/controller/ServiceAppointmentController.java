package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.ServiceAppointment;
import com.VisionExpress.demo.service.ServiceAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-appointments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ServiceAppointmentController {

    private final ServiceAppointmentService appointmentService;

    @Autowired
    public ServiceAppointmentController(ServiceAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/add")
    public ResponseEntity<ServiceAppointment> bookAppointment(@RequestBody ServiceAppointment appointment) {
        ServiceAppointment created = appointmentService.bookAppointment(appointment);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ServiceAppointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceAppointment> getAppointmentById(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ServiceAppointment>> getAppointmentsByMember(@PathVariable Integer memberId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByMember(memberId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ServiceAppointment>> getAppointmentsByEmployee(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByEmployee(employeeId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceAppointment> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ServiceAppointment> cancelAppointment(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }
}