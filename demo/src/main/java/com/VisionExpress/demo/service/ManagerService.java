package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Manager;
import com.VisionExpress.demo.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ManagerService {

    private final ManagerRepository managerRepository;

    @Autowired
    public ManagerService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    public List<Manager> getAllManagers() {
        return managerRepository.findAll();
    }

    public Optional<Manager> getManagerById(Integer managerId) {
        return managerRepository.findById(managerId);
    }

    public Manager saveManager(Manager manager) {
        if (manager.getEmployeeId() == null) {
            throw new IllegalArgumentException("Manager ID must match an existing valid Employee ID.");
        }
        return managerRepository.save(manager);
    }

    public void deleteManager(Integer managerId) {
        if (!managerRepository.existsById(managerId)) {
            throw new RuntimeException("Manager not found with ID: " + managerId);
        }
        managerRepository.deleteById(managerId);
    }

}