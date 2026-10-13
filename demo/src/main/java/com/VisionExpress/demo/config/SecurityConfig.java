
package com.VisionExpress.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                // Allow requests from the React frontend
                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()
                ))

                // Keep CSRF protection for session-based authentication
                .csrf(csrf -> csrf
                        .csrfTokenRepository(
                                CookieCsrfTokenRepository.withHttpOnlyFalse()
                        )
                        .csrfTokenRequestHandler(
                                new CsrfTokenRequestAttributeHandler()
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Public browsing
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/products/search",
                                "/api/users/doctors",
                                "/api/users/services",
                                "/api/doctors",
                                "/api/doctors/*"
                        ).permitAll()

                        // Public registration
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/users/register"
                        ).permitAll()

                        // CSRF token endpoint
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/auth/csrf"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/users/profile/**"
                        ).authenticated()

                        // Admin permissions
                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")

                        // Manager permissions
                        .requestMatchers("/api/managers/**")
                        .hasAnyRole("MANAGER", "ADMIN")

                        // Employee permissions
                        .requestMatchers("/api/employees/**")
                        .hasAnyRole("MANAGER", "ADMIN")

                        // Member permissions
                        .requestMatchers("/api/members/**")
                        .hasRole("MEMBER")

                        // Doctor appointment - Doctor updates consultation notes
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/doctor-appointments/*/notes"
                        ).hasAnyRole("DOCTOR", "ADMIN")

                        // Doctor appointment - Doctor updates status
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/doctor-appointments/*/status"
                        ).hasAnyRole("DOCTOR", "ADMIN")

                        // Doctor appointment permissions
                        .requestMatchers("/api/doctor-appointments/**")
                        .hasAnyRole("DOCTOR", "MEMBER", "ADMIN")

                        // Service appointment staff operations
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/service-appointments"
                        ).hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/service-appointments/*/complete",
                                "/api/service-appointments/*/status"
                        ).hasAnyRole("EMPLOYEE", "MANAGER", "ADMIN")

                        // Service appointment permissions
                        .requestMatchers("/api/service-appointments/**")
                        .hasAnyRole("MEMBER", "EMPLOYEE", "MANAGER", "ADMIN")

                        // Online shop - Admin confirms payments
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/orders/*/confirm-payment"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/orders"
                        ).hasRole("MEMBER")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/orders/*/payment-slip"
                        ).hasRole("MEMBER")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/my-orders"
                        ).hasRole("MEMBER")

                        .requestMatchers("/api/orders/**")
                        .hasRole("ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()

                )

                // Login handled by Spring Security
                .formLogin(form -> form
                        .loginProcessingUrl("/api/auth/login")
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpStatus.OK.value());
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"message\":\"Login successful\"}"
                            );
                        })
                        .failureHandler((request, response, exception) -> {
                            response.sendError(
                                    HttpStatus.UNAUTHORIZED.value(),
                                    "Invalid email or password"
                            );
                        })
                        .permitAll()
                )

                // Logout and invalidate the session
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((request, response, authentication) ->
                                response.setStatus(HttpStatus.OK.value())
                        )
                )

                // Return HTTP errors instead of redirecting React
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) ->
                                response.sendError(HttpStatus.UNAUTHORIZED.value())
                        )
                        .accessDeniedHandler((request, response, exception) ->
                                response.sendError(HttpStatus.FORBIDDEN.value())
                        )
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"
        ));

        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
                "Content-Type",
                "X-XSRF-TOKEN",
                "X-CSRF-TOKEN",
                "Accept",
                "X-Requested-With"
        ));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new CustomPasswordEncoder();
    }
}
