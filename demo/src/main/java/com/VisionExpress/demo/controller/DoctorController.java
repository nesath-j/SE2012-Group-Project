package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Doctor;
import com.VisionExpress.demo.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }
    // GET: http://localhost:8080/api/doctors
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDoctors() {
        List<Map<String, Object>> doctors = doctorService.getAllDoctors()
                .stream()
                .map(this::toPublicProfile)
                .toList();

        return ResponseEntity.ok(doctors);
    }
    // GET: http://localhost:8080/api/doctors/1
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(doctor -> ResponseEntity.ok(toPublicProfile(doctor)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: http://localhost:8080/api/doctors
    @PostMapping
    public ResponseEntity<String> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Doctor creation requires administrator authorization.");
    }

    // PUT: http://localhost:8080/api/doctors/1
    @PutMapping("/{id}")
    public ResponseEntity<String> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Doctor updates require administrator authorization.");
    }

    // DELETE: http://localhost:8080/api/doctors/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Doctor deletion requires administrator authorization.");
    }

    private Map<String, Object> toPublicProfile(Doctor doctor) {
        return Map.of(
                "doctorId", doctor.getDoctorId(),
                "firstName", doctor.getFirstName(),
                "lastName", doctor.getLastName(),
                "specialization", doctor.getSpecialization(),
                "licenseNumber", doctor.getLicenseNumber()
        );
    }
}
