package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.model.Product;

import com.VisionExpress.demo.repository.UserRepository;
import com.VisionExpress.demo.repository.ProductRepository;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // Password hashing settings
    private static final int ITERATIONS = 600_000;
    private static final int SALT_LENGTH = 16;
    private static final int KEY_LENGTH = 256;

    private static final SecureRandom RANDOM =
            new SecureRandom();

    // Constructor injection
    public UserService(UserRepository userRepository,
                       ProductRepository productRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Temporary doctor profiles
    private final List<String> doctorProfiles = Arrays.asList(
            "Dr. Nimal Perera - Senior Optometrist",
            "Dr. Amanda Silva - Consultant Ophthalmologist",
            "Dr. Rajesh Kumar - Optometrist"
    );

    // Temporary optical services
    private final List<String> opticalServices = Arrays.asList(
            "Comprehensive Eye Examination",
            "Spectacle Frame Fitting & Adjustment",
            "Contact Lens Fitting & Consultation",
            "Lens Replacement and Repair"
    );

    // 1. Register a new user
    public boolean register(User user, String rawPassword) {

        if (user == null || rawPassword == null) {
            return false;
        }

        if (user.getUserId() != 0 ||
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

        user.setFirstName(user.getFirstName().trim());
        user.setLastName(user.getLastName().trim());
        user.setEmail(email);

        // Prevent public registration with privileged roles
        user.setUserType("User");

        // Hash password before saving
        user.setPasswordHash(hashPassword(rawPassword));

        userRepository.save(user);

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
    public boolean updateProfile(
            int userId,
            String firstName,
            String lastName,
            String phone) {

        if (!validName(firstName) ||
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

    // 4. Search actual products from the database
    public List<Product> searchProducts(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return Collections.emptyList();
        }

        return productRepository
                .findByNameContainingIgnoreCase(keyword.trim());
    }

    // 5. View doctor profiles (temporary demo data)
    public List<String> viewDoctorProfiles() {
        return doctorProfiles;
    }

    // 6. View optical services (temporary demo data)
    public List<String> viewServices() {
        return opticalServices;
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

        byte[] salt = new byte[SALT_LENGTH];
        RANDOM.nextBytes(salt);

        byte[] hash = deriveKey(
                password.toCharArray(),
                salt,
                ITERATIONS
        );

        return "pbkdf2_sha256$" + ITERATIONS + "$"
                + Base64.getEncoder().encodeToString(salt)
                + "$"
                + Base64.getEncoder().encodeToString(hash);
    }

    // 8. Verify password
    private boolean verifyPassword(
            String password, String storedHash) {

        if (password == null || storedHash == null) {
            return false;
        }

        try {
            String[] parts = storedHash.split("\\$");

            if (parts.length != 4 ||
                    !parts[0].equals("pbkdf2_sha256")) {
                return false;
            }

            int iterations = Integer.parseInt(parts[1]);

            if (iterations != ITERATIONS) {
                return false;
            }

            byte[] salt =
                    Base64.getDecoder().decode(parts[2]);

            byte[] expectedHash =
                    Base64.getDecoder().decode(parts[3]);

            if (salt.length != SALT_LENGTH ||
                    expectedHash.length != KEY_LENGTH / 8) {
                return false;
            }

            byte[] actualHash = deriveKey(
                    password.toCharArray(),
                    salt,
                    iterations
            );

            return MessageDigest.isEqual(
                    actualHash,
                    expectedHash
            );

        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    // 9. Generate PBKDF2 hash
    private byte[] deriveKey(
            char[] password,
            byte[] salt,
            int iterations) {

        PBEKeySpec spec = new PBEKeySpec(
                password,
                salt,
                iterations,
                KEY_LENGTH
        );

        try {
            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance(
                            "PBKDF2WithHmacSHA256"
                    );

            return factory.generateSecret(spec)
                    .getEncoded();

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Password hashing failed", e
            );

        } finally {
            spec.clearPassword();
            Arrays.fill(password, '\0');
        }
    }
}
