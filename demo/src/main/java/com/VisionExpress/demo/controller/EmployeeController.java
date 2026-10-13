package com.VisionExpress.demo.controller;

import com.VisionExpress.demo.model.Employee;
import com.VisionExpress.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {

        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEmployees() {

        List<Map<String, Object>> employees = employeeService
                .getAllEmployees()
                .stream()
                .map(this::toEmployeeResponse)
                .toList();

        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id)
                .map(employee -> ResponseEntity.ok(
                        toEmployeeResponse(employee)))
                .orElseGet(() ->
                        ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Map<String, Object>>> getEmployeesByDepartment(
            @PathVariable String department) {

        List<Map<String, Object>> employees = employeeService
                .getEmployeesByDepartment(department)
                .stream()
                .map(this::toEmployeeResponse)
                .toList();

        return ResponseEntity.ok(employees);
    }

    @PostMapping
    public ResponseEntity<String> createEmployee(
            @RequestBody Employee employee) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Employee creation requires administrator authorization.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Employee updates require administrator authorization.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long id) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Employee deletion requires administrator authorization.");
    }

    private Map<String, Object> toEmployeeResponse(Employee employee) {

        return Map.of(
                "employeeId", employee.getEmployeeId(),
                "firstName", employee.getFirstName(),
                "lastName", employee.getLastName(),
                "roleTitle", employee.getRoleTitle(),
                "assignedDepartment",
                employee.getAssignedDepartment() == null
                        ? ""
                        : employee.getAssignedDepartment()
        );
    }
}
