package com.minutdel.controller;

import com.minutdel.dto.AdminAnalyticsResponse;
import com.minutdel.model.Order;
import com.minutdel.model.OrderStatus;
import com.minutdel.repository.OrderRepository;
import com.minutdel.service.AdminAnalyticsService;
import com.minutdel.service.OrderStreamService;
import com.minutdel.service.SecurityTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminAnalyticsService adminAnalyticsService;
    private final OrderRepository orderRepository;
    private final SecurityTokenService securityTokenService;
    private final OrderStreamService orderStreamService;

    public AdminController(AdminAnalyticsService adminAnalyticsService,
                           OrderRepository orderRepository,
                           SecurityTokenService securityTokenService,
                           OrderStreamService orderStreamService) {
        this.adminAnalyticsService = adminAnalyticsService;
        this.orderRepository = orderRepository;
        this.securityTokenService = securityTokenService;
        this.orderStreamService = orderStreamService;
    }

    private SecurityTokenService.TokenPrincipal authenticateAdmin(String authHeader) {
        SecurityTokenService.TokenPrincipal principal = securityTokenService.validateToken(authHeader);
        if (principal == null || !principal.isAdmin()) {
            return null;
        }
        return principal;
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        SecurityTokenService.TokenPrincipal admin = authenticateAdmin(authHeader);
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Administrator privileges (ROLE_ADMIN) required."));
        }
        AdminAnalyticsResponse analytics = adminAnalyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        SecurityTokenService.TokenPrincipal admin = authenticateAdmin(authHeader);
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Administrator privileges (ROLE_ADMIN) required."));
        }
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        SecurityTokenService.TokenPrincipal admin = authenticateAdmin(authHeader);
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: Administrator privileges (ROLE_ADMIN) required."));
        }

        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            if (status == OrderStatus.DELIVERED) {
                order.setEstimatedMinutesRemaining(0);
            }
            Order saved = orderRepository.save(order);
            orderStreamService.broadcastOrderUpdate(saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }
}
