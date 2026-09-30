package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final List<String> productCatalog = Arrays.asList(
            "Ray-Ban Aviator Classic (Frames)",
            "Oakley Holbrook Polarized (Sunglasses)",
            "Anti-Reflective Single Vision (Lenses)",
            "Blue-Light Blocking Reading Glasses (Frames)",
            "Transitions Signature Gen 8 (Lenses)"
    );

    private final List<String> doctorProfiles = Arrays.asList(
            "Dr. Nimal Perera - Senior Optometrist (Specialization: Pediatric Optometry)",
            "Dr. Amanda Silva - Consultant Ophthalmologist (Specialization: Cataract & Refractive)",
            "Dr. Rajesh Kumar - Optometrist (Specialization: Contact Lens Specialist)"
    );

    private final List<String> opticalServices = Arrays.asList(
            "Comprehensive Eye Examination",
            "Spectacle Frame Fitting & Adjustment",
            "Contact Lens Fitting & Consultation",
            "Lens Replacement and Repair"
    );

    // register() operation[cite: 2]
    public boolean register(User user) {
        if (user == null || user.getEmail() == null || user.getPasswordHash() == null) {
            return false;
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return false;
        }

        if (user.getUserType() == null || user.getUserType().trim().isEmpty()) {
            user.setUserType("Member");
        }

        userRepository.save(user);
        return true;
    }

    // login() operation[cite: 2]
    public User login(String email, String rawPassword) {
        if (email == null || rawPassword == null) {
            return null;
        }

        Optional<User> optionalUser = userRepository.findByEmail(email.trim());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPasswordHash().equals(rawPassword)) {
                return user;
            }
        }
        return null;
    }

    // updateProfile() operation[cite: 2]
    public boolean updateProfile(int userId, String firstName, String lastName, String phone) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setFirstName(firstName);
            existingUser.setLastName(lastName);
            existingUser.setPhone(phone);
            userRepository.save(existingUser);
            return true;
        }
        return false;
    }

    // searchProducts(keyword) operation[cite: 2]
    public List<String> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return productCatalog.stream()
                .filter(p -> p.toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    // viewDoctorProfiles() operation[cite: 2]
    public List<String> viewDoctorProfiles() {
        return doctorProfiles;
    }

    // viewServices() operation[cite: 2]
    public List<String> viewServices() {
        return opticalServices;
    }
}