package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Doctor;
import com.VisionExpress.demo.repository.DoctorRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    // Constructor injection
    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // 1. Get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 2. Get doctor by ID
    public Optional<Doctor> getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId);
    }

    // 3. Save a doctor
    @Transactional
    public Doctor saveDoctor(Doctor doctor) {

        if (doctor == null) {
            throw new IllegalArgumentException(
                    "Doctor cannot be null.");
        }

        if (doctor.getUserId() != null) {
            throw new IllegalArgumentException(
                    "A new doctor must not have an existing User ID.");
        }

        // The inherited User ID is generated when saved
        return doctorRepository.save(doctor);
    }

    // 4. Update doctor details
    @Transactional
    public Doctor updateDoctor(Long doctorId, Doctor updatedDoctor) {

        if (updatedDoctor == null) {
            throw new IllegalArgumentException(
                    "Updated doctor details cannot be null.");
        }

        Doctor existingDoctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Doctor not found with ID: " + doctorId));

        // Do not change the inherited User ID
        existingDoctor.setSpecialization(
                updatedDoctor.getSpecialization());

        existingDoctor.setLicenseNumber(
                updatedDoctor.getLicenseNumber());

        return doctorRepository.save(existingDoctor);
    }

    // 5. Delete doctor
    @Transactional
    public boolean deleteDoctor(Long doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            return false;
        }

        doctorRepository.deleteById(doctorId);
        return true;
    }
}
