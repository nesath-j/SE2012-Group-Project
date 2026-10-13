package com.VisionExpress.demo.config;

import org.springframework.security.crypto.password.PasswordEncoder;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

public class CustomPasswordEncoder implements PasswordEncoder {

    private static final int ITERATIONS = 600_000;
    private static final int SALT_LENGTH = 16;
    private static final int KEY_LENGTH = 256;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    public String encode(CharSequence rawPassword) {

        byte[] salt = new byte[SALT_LENGTH];
        RANDOM.nextBytes(salt);

        byte[] hash = deriveKey(
                rawPassword.toString().toCharArray(),
                salt,
                ITERATIONS
        );

        return "pbkdf2_sha256$" + ITERATIONS + "$"
                + Base64.getEncoder().encodeToString(salt)
                + "$"
                + Base64.getEncoder().encodeToString(hash);
    }

    @Override
    public boolean matches(CharSequence rawPassword,
                           String encodedPassword) {

        if (rawPassword == null || encodedPassword == null) {
            return false;
        }

        try {
            String[] parts = encodedPassword.split("\\$");

            if (parts.length != 4 ||
                    !parts[0].equals("pbkdf2_sha256")) {
                return false;
            }

            int iterations = Integer.parseInt(parts[1]);

            if (iterations != ITERATIONS) {
                return false;
            }

            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] expectedHash = Base64.getDecoder().decode(parts[3]);

            if (salt.length != SALT_LENGTH ||
                    expectedHash.length != KEY_LENGTH / 8) {
                return false;
            }

            byte[] actualHash = deriveKey(
                    rawPassword.toString().toCharArray(),
                    salt,
                    iterations
            );

            return MessageDigest.isEqual(actualHash, expectedHash);

        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private byte[] deriveKey(char[] password,
                             byte[] salt,
                             int iterations) {

        PBEKeySpec spec = new PBEKeySpec(
                password,
                salt,
                iterations,
                KEY_LENGTH
        );

        try {
            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance(
                            "PBKDF2WithHmacSHA256"
                    );

            return factory.generateSecret(spec).getEncoded();

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Password hashing failed", e
            );

        } finally {
            spec.clearPassword();
            Arrays.fill(password, '\0');
        }
    }
}

