package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Doctor;
import com.VisionExpress.demo.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId);
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long doctorId, Doctor updatedDoctor) {
        return doctorRepository.findById(doctorId)
                .map(existingDoctor -> {
                    existingDoctor.setUserId(updatedDoctor.getUserId());
                    existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
                    existingDoctor.setLicenseNumber(updatedDoctor.getLicenseNumber());

                    return doctorRepository.save(existingDoctor);
                })
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
    }

    public boolean deleteDoctor(Long doctorId) {
        if (doctorRepository.existsById(doctorId)) {
            doctorRepository.deleteById(doctorId);
            return true;
        }
        return false;
    }
}