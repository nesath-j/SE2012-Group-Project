package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.Manager;
import com.VisionExpress.demo.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Optional<Manager> getManagerById(Long managerId) {
        return managerRepository.findById(managerId);
    }

    public Manager saveManager(Manager manager) {
        if (manager == null) {
            throw new IllegalArgumentException(
                    "Manager cannot be null.");
        }

        throw new UnsupportedOperationException(
                "Manager creation or Employee promotion must be " +
                        "implemented with the User-Employee-Manager " +
                        "inheritance structure.");
    }

    public void deleteManager(Long managerId) {
        if (managerId == null) {
            throw new IllegalArgumentException(
                    "Manager ID cannot be null.");
        }

        throw new UnsupportedOperationException(
                "Manager deletion is disabled until account " +
                        "management and authorization are implemented.");
    }
}
