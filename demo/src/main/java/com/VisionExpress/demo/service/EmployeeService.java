package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Employee;
import com.VisionExpress.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Integer employeeId) {
        return employeeRepository.findById(employeeId);
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByAssignedDepartment(department);
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Integer employeeId, Employee updatedEmployee) {
        return employeeRepository.findById(employeeId)
                .map(existingEmployee -> {
                    existingEmployee.setRoleTitle(updatedEmployee.getRoleTitle());
                    existingEmployee.setAssignedDepartment(updatedEmployee.getAssignedDepartment());
                    return employeeRepository.save(existingEmployee);
                })
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
    }

    public void deleteEmployee(Integer employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("Employee not found with id: " + employeeId);
        }
        employeeRepository.deleteById(employeeId);
    }
}