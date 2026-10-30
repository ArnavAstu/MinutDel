package com.minutdel.controller;

import com.minutdel.dto.OrderRequest;
import com.minutdel.model.Order;
import com.minutdel.service.OrderService;
import com.minutdel.service.OrderStreamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final OrderStreamService orderStreamService;
    private final com.minutdel.service.AwsEmailService awsEmailService;

    public OrderController(OrderService orderService, OrderStreamService orderStreamService, com.minutdel.service.AwsEmailService awsEmailService) {
        this.orderService = orderService;
        this.orderStreamService = orderStreamService;
        this.awsEmailService = awsEmailService;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest request) {
        try {
            Order order = orderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process order: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Server-Sent Events (SSE) endpoint for real-time delivery tracking
     */
    @GetMapping(value = "/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamOrderUpdates(@PathVariable Long id) {
        Order order = orderService.getOrderById(id).orElse(null);
        return orderStreamService.subscribeToOrder(id, order);
    }

    /**
     * View/verify the exact AWS SES Tax Invoice & Bill generated for this order
     */
    @GetMapping(value = "/{id}/invoice", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getOrderInvoice(@PathVariable Long id) {
        String invoice = awsEmailService.getInvoiceHtml(id);
        if (invoice != null) {
            return ResponseEntity.ok(invoice);
        }
        return orderService.getOrderById(id)
                .map(order -> {
                    awsEmailService.sendOrderInvoiceEmail(order);
                    return ResponseEntity.ok(awsEmailService.getInvoiceHtml(id));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        boolean cancelled = orderService.cancelOrder(id);
        if (cancelled) {
            orderService.getOrderById(id).ifPresent(orderStreamService::broadcastOrderUpdate);
            return ResponseEntity.ok(Map.of("message", "Order #" + id + " has been cancelled."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Order cannot be cancelled in its current state."));
        }
    }
}
