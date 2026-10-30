package com.minutdel.service;

import com.minutdel.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class SecurityTokenService {

    @Value("${jwt.secret:MinutDel-Production-Secure-Signing-Key-2026-SuperSecretKey!}")
    private String secretKey;

    private static final long TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000L; // 24 Hours

    public String hashPassword(String rawPassword) {
        try {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[16];
            random.nextBytes(salt);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hashedPassword);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public boolean verifyPassword(String rawPassword, String storedHash) {
        try {
            if (storedHash == null || !storedHash.contains(":")) return false;
            String[] parts = storedHash.split(":");
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] expectedHash = Base64.getDecoder().decode(parts[1]);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] actualHash = md.digest(rawPassword.getBytes(StandardCharsets.UTF_8));

            return MessageDigest.isEqual(expectedHash, actualHash);
        } catch (Exception e) {
            return false;
        }
    }

    public String generateToken(User user) {
        long expiry = System.currentTimeMillis() + TOKEN_VALIDITY_MS;
        String payload = user.getId() + "|" + user.getEmail() + "|" + user.getRole() + "|" + expiry;
        String signature = sign(payload);
        return Base64.getUrlEncoder().encodeToString((payload + "." + signature).getBytes(StandardCharsets.UTF_8));
    }

    public TokenPrincipal validateToken(String token) {
        try {
            if (token == null || token.isBlank()) return null;
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
            int lastDot = decoded.lastIndexOf('.');
            if (lastDot == -1) return null;

            String payload = decoded.substring(0, lastDot);
            String signature = decoded.substring(lastDot + 1);

            if (!sign(payload).equals(signature)) {
                return null; // Tampered token
            }

            String[] parts = payload.split("\\|");
            Long userId = Long.parseLong(parts[0]);
            String email = parts[1];
            String role = parts[2];
            long expiry = Long.parseLong(parts[3]);

            if (System.currentTimeMillis() > expiry) {
                return null; // Expired
            }

            return new TokenPrincipal(userId, email, role);
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256Hmac.init(secretKeySpec);
            byte[] signedBytes = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error signing security token", e);
        }
    }

    public static class TokenPrincipal {
        private final Long userId;
        private final String email;
        private final String role;

        public TokenPrincipal(Long userId, String email, String role) {
            this.userId = userId;
            this.email = email;
            this.role = role;
        }

        public Long getUserId() { return userId; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public boolean isAdmin() { return "ROLE_ADMIN".equalsIgnoreCase(role); }
    }
}
