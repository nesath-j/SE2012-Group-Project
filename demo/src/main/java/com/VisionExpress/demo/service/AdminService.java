package com.VisionExpress.service;

import com.VisionExpress.model.SystemSetting;
import com.VisionExpress.model.User;
import com.VisionExpress.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    // + manageUserAccounts(userId: int, action: String): void[cite: 2]
    @Transactional
    public void manageUserAccounts(int userId, String action) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " does not exist."));

        if ("DELETE".equalsIgnoreCase(action)) {
            userRepository.delete(user);
        } else if ("DEACTIVATE".equalsIgnoreCase(action)) {
            user.setUserType("Inactive_" + user.getUserType());
            userRepository.save(user);
        } else if ("ACTIVATE".equalsIgnoreCase(action)) {
            if (user.getUserType().startsWith("Inactive_")) {
                user.setUserType(user.getUserType().replace("Inactive_", ""));
                userRepository.save(user);
            }
        } else {
            throw new IllegalArgumentException("Unsupported account action: " + action);
        }
    }

    // + configurePaymentSystem(configData: String): void[cite: 2]
    @Transactional
    public void configurePaymentSystem(String configData) {
        if (configData == null || configData.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment configuration payload cannot be empty.");
        }

    }
}
