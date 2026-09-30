package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // POST /api/admin/users/{userId}/manage?action=DEACTIVATE[cite: 2]
    @PostMapping("/users/{userId}/manage")
    public ResponseEntity<String> manageUserAccounts(@PathVariable int userId, @RequestParam String action) {
        try {
            adminService.manageUserAccounts(userId, action);
            return ResponseEntity.ok("User account action '" + action + "' processed successfully for User ID: " + userId);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // POST /api/admin/payment-config[cite: 2]
    @PostMapping("/payment-config")
    public ResponseEntity<String> configurePaymentSystem(@RequestBody String configData) {
        try {
            adminService.configurePaymentSystem(configData);
            return ResponseEntity.ok("Payment configuration saved successfully.");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}