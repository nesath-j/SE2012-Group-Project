package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.DoctorSchedule;
import com.VisionExpress.demo.repository.DoctorScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;

    public DoctorScheduleService(DoctorScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<DoctorSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    public Optional<DoctorSchedule> getScheduleById(Long scheduleId) {
        return scheduleRepository.findById(scheduleId);
    }
    public List<DoctorSchedule> getDoctorSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId);
    }

    public List<DoctorSchedule> getAvailableSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorIdAndIsBookedFalse(doctorId);
    }

    public DoctorSchedule addSchedule(DoctorSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public DoctorSchedule updateSchedule(Long scheduleId, DoctorSchedule updatedSchedule) {
        return scheduleRepository.findById(scheduleId)
                .map(existingSchedule -> {
                    existingSchedule.setDoctorId(updatedSchedule.getDoctorId());
                    existingSchedule.setAvailableDate(updatedSchedule.getAvailableDate());
                    existingSchedule.setStartTime(updatedSchedule.getStartTime());
                    existingSchedule.setEndTime(updatedSchedule.getEndTime());
                    existingSchedule.setBooked(updatedSchedule.isBooked());
                    return scheduleRepository.save(existingSchedule);
                })
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
    }

    public boolean deleteSchedule(Long scheduleId) {
        if (scheduleRepository.existsById(scheduleId)) {
            scheduleRepository.deleteById(scheduleId);
            return true;
        }
        return false;
    }
}