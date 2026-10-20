package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.model.Member;
import com.VisionExpress.demo.model.Product;
import com.VisionExpress.demo.model.Doctor;

import com.VisionExpress.demo.repository.UserRepository;
import com.VisionExpress.demo.repository.MemberRepository;
import com.VisionExpress.demo.repository.ProductRepository;
import com.VisionExpress.demo.repository.DoctorRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final DoctorRepository doctorRepository;
    private final ServiceAppointmentService serviceAppointmentService;
    private final PasswordEncoder passwordEncoder;

    // Password hashing settings
    // Password hashing is now handled by CustomPasswordEncoder.

    // Constructor injection
    public UserService(UserRepository userRepository,
                       MemberRepository memberRepository,
                       ProductRepository productRepository,
                       DoctorRepository doctorRepository,
                       ServiceAppointmentService serviceAppointmentService,
                       PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
        this.productRepository = productRepository;
        this.doctorRepository = doctorRepository;
        this.serviceAppointmentService = serviceAppointmentService;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Register a new user
    public boolean register(User user, String rawPassword) {

        if (user == null || rawPassword == null) {
            return false;
        }

        // Changed: Long userId is null before saving
        if (user.getUserId() != null ||
                !validName(user.getFirstName()) ||
                !validName(user.getLastName()) ||
                !validEmail(user.getEmail()) ||
                rawPassword.length() < 8 ||
                (user.getPhone() != null &&
                        user.getPhone().length() > 20)) {
            return false;
        }

        String email = user.getEmail()
                .trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            return false;
        }

        Member member = new Member();

        member.setFirstName(user.getFirstName().trim());
        member.setLastName(user.getLastName().trim());
        member.setEmail(email);
        member.setPhone(user.getPhone());

        // Prevent public registration with privileged roles
        member.setUserType("MEMBER");

        // Hash password before saving
        member.setPasswordHash(hashPassword(rawPassword));

        member.setLoyaltyPoints(0);
        member.setTotalEarnedPoints(0);

        memberRepository.save(member);

        return true;
    }

    // 2. Login
    public boolean login(String email, String rawPassword) {

        if (email == null || rawPassword == null) {
            return false;
        }

        Optional<User> optionalUser =
                userRepository.findByEmail(
                        email.trim().toLowerCase(Locale.ROOT)
                );

        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();

        return verifyPassword(
                rawPassword,
                user.getPasswordHash()
        );
    }

    // 3. Update user profile
    // Changed: int userId -> Long userId
    public boolean updateProfile(
            Long userId,
            String firstName,
            String lastName,
            String phone) {

        if (userId == null ||
                !validName(firstName) ||
                !validName(lastName) ||
                (phone != null && phone.length() > 20)) {
            return false;
        }

        Optional<User> optionalUser =
                userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return false;
        }

        User existingUser = optionalUser.get();

        existingUser.setFirstName(firstName.trim());
        existingUser.setLastName(lastName.trim());
        existingUser.setPhone(phone);

        userRepository.save(existingUser);

        return true;
    }

    // 4. Search products from database
    public List<Product> searchProducts(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll();
        }

        return productRepository
                .findByNameContainingIgnoreCase(keyword.trim());
    }

    // 5. View doctors from database
    public List<Doctor> viewDoctorProfiles() {
        return doctorRepository.findAll();
    }

    // 6. View optical services (temporary demo data)
    public List<String> viewServices() {
        return serviceAppointmentService.getAvailableServices();
    }

    // Validate user names
    private boolean validName(String name) {
        return name != null &&
                !name.isBlank() &&
                name.trim().length() <= 50;
    }

    // Validate email
    private boolean validEmail(String email) {
        return email != null &&
                email.trim().length() <= 100 &&
                email.trim().matches(
                        "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
                );
    }

    // 7. Hash password using PBKDF2
    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    // 8. Verify password
    private boolean verifyPassword(
            String password, String storedHash) {
        return passwordEncoder.matches(password, storedHash);
    }

    // Find user by email for authenticated profile access
    public User findByEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return userRepository.findByEmail(email).orElse(null);
    }
}
