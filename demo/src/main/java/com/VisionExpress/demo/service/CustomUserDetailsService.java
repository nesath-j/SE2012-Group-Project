package com.VisionExpress.demo.service;

import com.VisionExpress.demo.model.User;
import com.VisionExpress.demo.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        if (email == null || email.isBlank()) {
            throw new UsernameNotFoundException(
                    "User not found.");
        }

        User user = userRepository.findByEmail(
                email.trim().toLowerCase(Locale.ROOT)
        ).orElseThrow(() ->
                new UsernameNotFoundException(
                        "User not found.")
        );

        String role = user.getUserType();

        if (role == null || !switch (role.toUpperCase(Locale.ROOT)) {
            case "USER", "MEMBER", "DOCTOR",
                 "EMPLOYEE", "MANAGER", "ADMIN" -> true;
            default -> false;
        }) {
            throw new UsernameNotFoundException(
                    "Invalid user role.");
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(role.toUpperCase(Locale.ROOT))
                .build();
    }
}
