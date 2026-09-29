package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.DoctorSchedule;
import com.VisionExpress.demo.repository.DoctorScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;

    public DoctorScheduleService(DoctorScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public DoctorSchedule addSchedule(DoctorSchedule schedule) {
        schedule.setBooked(false);
        return scheduleRepository.save(schedule);
    }

    public List<DoctorSchedule> getAvailableSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorIdAndIsBookedFalse(doctorId);
    }

    public List<DoctorSchedule> getDoctorSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId);
    }
}