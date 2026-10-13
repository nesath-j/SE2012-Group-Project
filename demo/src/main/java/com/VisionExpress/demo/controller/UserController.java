
package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.model.Product;
import com.VisionExpress.demo.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Constructor injection
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1. Register a new user
    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody Map<String, String> request) {

        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String email = request.get("email");
        String password = request.get("password");
        String phone = request.get("phone");

        User user = new User();

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhone(phone);

        boolean registered =
                userService.register(user, password);

        if (registered) {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Member registered successfully.");
        }

        return ResponseEntity
                .badRequest()
                .body("Registration failed: Invalid details or email already exists.");
    }

    // 3. Update user profile
    // Changed: int userId -> Long userId
    // PUT /api/users/profile/{userId}
    // Demo only: authorization must be implemented
    @PutMapping("/profile/{userId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable Long userId,
            @RequestBody User user,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        User currentUser = userService.findByEmail(
                authentication.getName()
        );

        if (currentUser == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authenticated user not found.");
        }

        if (!currentUser.getUserId().equals(userId)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You can only update your own profile.");
        }

        boolean updated = userService.updateProfile(
                userId,
                user.getFirstName(),
                user.getLastName(),
                user.getPhone()
        );

        if (updated) {
            return ResponseEntity.ok(
                    "Profile updated successfully.");
        }

        return ResponseEntity
                .badRequest()
                .body("Profile update failed: Invalid details or user not found.");
    }

    // 4. Search products from database
    // GET /api/users/products/search?keyword=Ray
    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam String keyword) {

        List<Product> products =
                userService.searchProducts(keyword);

        return ResponseEntity.ok(products);
    }

    // 5. View doctor profiles from database
    // GET /api/users/doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<Map<String, Object>>> viewDoctorProfiles() {

        List<Map<String, Object>> doctors =
                userService.viewDoctorProfiles()
                        .stream()
                        .map(doctor -> Map.<String, Object>of(
                                "doctorId", doctor.getDoctorId(),
                                "firstName", doctor.getFirstName(),
                                "lastName", doctor.getLastName(),
                                "specialization", doctor.getSpecialization(),
                                "licenseNumber", doctor.getLicenseNumber()
                        ))
                        .toList();

        return ResponseEntity.ok(doctors);
    }

    // 6. View optical services (temporary demo data)
    // GET /api/users/services
    @GetMapping("/services")
    public ResponseEntity<List<String>> viewServices() {

        List<String> services =
                userService.viewServices();

        return ResponseEntity.ok(services);
    }

}
