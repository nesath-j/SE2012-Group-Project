package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        boolean isRegistered = userService.register(user);
        if (isRegistered) {
            return new ResponseEntity<>("User registered successfully. User ID: " + user.getUserId(), HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Registration failed: Invalid details or email already exists.", HttpStatus.BAD_REQUEST);
    }

    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String email, @RequestParam String password) {
        User loggedUser = userService.login(email, password);
        if (loggedUser != null) {
            return ResponseEntity.ok(loggedUser);
        }
        return new ResponseEntity<>("Invalid credentials.", HttpStatus.UNAUTHORIZED);
    }

    // PUT /api/users/profile/{userId}
    @PutMapping("/profile/{userId}")
    public ResponseEntity<String> updateProfile(@PathVariable int userId, @RequestBody User user) {
        boolean updated = userService.updateProfile(userId, user.getFirstName(), user.getLastName(), user.getPhone());
        if (updated) {
            return ResponseEntity.ok("Profile updated successfully.");
        }
        return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
    }

    // GET /api/users/products/search?keyword=Frames
    @GetMapping("/products/search")
    public ResponseEntity<List<String>> searchProducts(@RequestParam String keyword) {
        List<String> products = userService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    // GET /api/users/doctors
    @GetMapping("/doctors")
    public ResponseEntity<List<String>> viewDoctorProfiles() {
        List<String> doctors = userService.viewDoctorProfiles();
        return ResponseEntity.ok(doctors);
    }

    // GET /api/users/services
    @GetMapping("/services")
    public ResponseEntity<List<String>> viewServices() {
        List<String> services = userService.viewServices();
        return ResponseEntity.ok(services);
    }
}