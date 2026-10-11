package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;

    // Temporary settings for local demonstration
    private final Map<String, String> systemSettings =
            new HashMap<>();

    private final Map<String, String> paymentSettings =
            new HashMap<>();

    // Constructor injection
    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. Manage user accounts
    public void manageUserAccounts(int userId, String action) {

        if (action == null || action.isBlank()) {
            throw new IllegalArgumentException(
                    "Action cannot be empty.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found: " + userId));

        switch (action.toUpperCase()) {

            case "VIEW":
                // User exists and can be viewed
                // through an authorized read operation.
                break;

            case "ACTIVATE":
            case "DEACTIVATE":
                throw new UnsupportedOperationException(
                        "Account status management is not yet implemented.");

            default:
                throw new IllegalArgumentException(
                        "Invalid action: " + action);
        }
    }

    // 2. Configure system settings (temporary demo)
    public void configureSystemSettings(
            String settingKey, String val) {

        if (settingKey == null || settingKey.isBlank()
                || val == null || val.isBlank()) {
            throw new IllegalArgumentException(
                    "Invalid system setting.");
        }

        switch (settingKey) {

            case "maintenanceMode":
            case "appointmentBookingEnabled":
            case "loyaltyPointsEnabled":
                if (!val.equals("true") &&
                        !val.equals("false")) {
                    throw new IllegalArgumentException(
                            "Setting value must be true or false.");
                }

                systemSettings.put(settingKey, val);
                break;

            default:
                throw new IllegalArgumentException(
                        "Unsupported system setting.");
        }
    }

    // 3. Configure payment system (temporary demo)
    public void configurePaymentSystem(String configData) {

        if (configData == null || configData.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment configuration cannot be empty.");
        }

        // Accept only a simple enable/disable setting
        if (configData.equals("ONLINE_PAYMENT_ENABLED=true")) {
            paymentSettings.put("onlinePaymentEnabled", "true");

        } else if (configData.equals(
                "ONLINE_PAYMENT_ENABLED=false")) {
            paymentSettings.put("onlinePaymentEnabled", "false");

        } else {
            throw new IllegalArgumentException(
                    "Unsupported payment configuration.");
        }
    }
}
