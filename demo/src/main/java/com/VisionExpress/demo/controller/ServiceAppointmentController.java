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
public class ServiceAppointmentController {

    private final ServiceAppointmentService appointmentService;

    @Autowired
    public ServiceAppointmentController(ServiceAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }


    @PostMapping("/add")
    public ResponseEntity<?> bookAppointment(
            @RequestBody ServiceAppointment appointment) {

        try {
            ServiceAppointment created =
                    appointmentService.bookAppointment(appointment);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(created);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
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
    public ResponseEntity<List<ServiceAppointment>> getAppointmentsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByMember(memberId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ServiceAppointment>> getAppointmentsByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByEmployee(employeeId));
    }

    // Employee completes appointment: Scheduled -> Completed[cite: 3]
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ServiceAppointment> completeAppointment(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.completeAppointment(id));
    }

    // Member or Employee cancellation endpoint[cite: 3]
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ServiceAppointment> cancelAppointment(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceAppointment> updateStatus(@PathVariable Integer id, @RequestParam String status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }
}
