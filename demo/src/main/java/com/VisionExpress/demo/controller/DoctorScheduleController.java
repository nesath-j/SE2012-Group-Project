package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.DoctorSchedule;
import com.VisionExpress.demo.service.DoctorScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-schedules")
@CrossOrigin(origins = "*")
public class DoctorScheduleController {

    private final DoctorScheduleService scheduleService;

    public DoctorScheduleController(DoctorScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // GET: http://localhost:8080/api/doctor-schedules
    @GetMapping
    public ResponseEntity<List<DoctorSchedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    // GET: http://localhost:8080/api/doctor-schedules/1
    @GetMapping("/{id}")
    public ResponseEntity<DoctorSchedule> getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: http://localhost:8080/api/doctor-schedules/doctor/1
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorSchedule>> getSchedulesByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(scheduleService.getDoctorSchedules(doctorId));
    }

    // GET: http://localhost:8080/api/doctor-schedules/doctor/1/available
    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<List<DoctorSchedule>> getAvailableSchedulesByDoctorId(@PathVariable Long doctorId) {
        return ResponseEntity.ok(scheduleService.getAvailableSchedules(doctorId));
    }

    // POST: http://localhost:8080/api/doctor-schedules
    @PostMapping
    public ResponseEntity<DoctorSchedule> createSchedule(@RequestBody DoctorSchedule schedule) {
        DoctorSchedule savedSchedule = scheduleService.addSchedule(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSchedule);
    }

    // PUT: http://localhost:8080/api/doctor-schedules/1
    @PutMapping("/{id}")
    public ResponseEntity<DoctorSchedule> updateSchedule(@PathVariable Long id, @RequestBody DoctorSchedule schedule) {
        try {
            DoctorSchedule updated = scheduleService.updateSchedule(id, schedule);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: http://localhost:8080/api/doctor-schedules/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        if (scheduleService.deleteSchedule(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}