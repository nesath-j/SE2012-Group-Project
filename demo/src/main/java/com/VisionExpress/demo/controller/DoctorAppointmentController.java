package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.DoctorAppointment;
import com.VisionExpress.demo.service.DoctorAppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor-appointments")
public class DoctorAppointmentController {

    private final DoctorAppointmentService appointmentService;

    public DoctorAppointmentController(DoctorAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // POST: http://localhost:8080/api/doctor-appointments
    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody DoctorAppointment appointment) {
        try {
            DoctorAppointment created = appointmentService.bookAppointment(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // GET: http://localhost:8080/api/doctor-appointments/doctor/1
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorAppointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    // GET: http://localhost:8080/api/doctor-appointments/member/1
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<DoctorAppointment>> getAppointmentsByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByMember(memberId));
    }

    // PUT: http://localhost:8080/api/doctor-appointments/1/notes
    @PutMapping("/{id}/notes")
    public ResponseEntity<DoctorAppointment> updateNotes(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            DoctorAppointment updated = appointmentService.updateConsultationNotes(id, payload.get("notes"));
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: http://localhost:8080/api/doctor-appointments/1/status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        try {
            String requestedStatus = payload.get("status");

            if (requestedStatus == null || requestedStatus.isBlank()) {
                return ResponseEntity.badRequest()
                        .body("Appointment status is required.");
            }

            DoctorAppointment.AppointmentStatus status =
                    DoctorAppointment.AppointmentStatus.valueOf(
                            requestedStatus.trim().toUpperCase(Locale.ROOT)
                    );

            DoctorAppointment updated = appointmentService.updateStatus(id, status);
            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid appointment status or appointment ID.");

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE: http://localhost:8080/api/doctor-appointments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        try {
            if (appointmentService.cancelAppointment(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}
