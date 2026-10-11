package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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

    // 1. Register a user
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
                    .body("User registered successfully. User ID: "
                            + user.getUserId());
        }

        return ResponseEntity
                .badRequest()
                .body("Registration failed: Invalid details or email already exists.");
    }

    // 2. Login
    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        boolean successful =
                userService.login(email, password);

        if (successful) {
            return ResponseEntity.ok(
                    "Credentials verified successfully.");
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials.");
    }

    // 3. Update profile
    // PUT /api/users/profile/{userId}
    // Demo only: authorization must be added before use.
    @PutMapping("/profile/{userId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable int userId,
            @RequestBody User user) {

        // TODO: Verify that the authenticated user owns
        // this profile before allowing an update.

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

    // 4. Search products (temporary demo data)
    // GET /api/users/products/search?keyword=Frames
    @GetMapping("/products/search")
    public ResponseEntity<List<String>> searchProducts(
            @RequestParam String keyword) {

        List<String> products =
                userService.searchProducts(keyword);

        return ResponseEntity.ok(products);
    }

    // 5. View doctors (temporary demo data)
    // GET /api/users/doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<String>> viewDoctorProfiles() {

        List<String> doctors =
                userService.viewDoctorProfiles();

        return ResponseEntity.ok(doctors);
    }

    // 6. View services
    // GET /api/users/services
    @GetMapping("/services")
    public ResponseEntity<List<String>> viewServices() {

        List<String> services =
                userService.viewServices();

        return ResponseEntity.ok(services);
    }
}
