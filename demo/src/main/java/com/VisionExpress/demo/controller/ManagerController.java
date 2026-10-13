package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Manager;
import com.VisionExpress.demo.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/managers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ManagerController {

    private final ManagerService managerService;

    @Autowired
    public ManagerController(ManagerService managerService) {
        this.managerService = managerService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllManagers() {

        List<Map<String, Object>> managers =
                managerService.getAllManagers()
                        .stream()
                        .map(this::toManagerResponse)
                        .toList();

        return ResponseEntity.ok(managers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getManagerById(
            @PathVariable Long id) {

        return managerService.getManagerById(id)
                .map(manager -> ResponseEntity.ok(
                        toManagerResponse(manager)))
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createManager(
            @RequestBody Manager manager) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Manager creation requires administrator authorization.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteManager(
            @PathVariable Long id) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Manager deletion requires administrator authorization.");
    }

    private Map<String, Object> toManagerResponse(Manager manager) {

        return Map.of(
                "managerId", manager.getEmployeeId(),
                "firstName", manager.getFirstName(),
                "lastName", manager.getLastName(),
                "roleTitle", manager.getRoleTitle(),
                "assignedDepartment",
                manager.getAssignedDepartment() == null
                        ? ""
                        : manager.getAssignedDepartment()
        );
    }
}
