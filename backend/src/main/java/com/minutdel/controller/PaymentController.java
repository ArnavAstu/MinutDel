package com.minutdel.controller;

import com.minutdel.dto.MockPaymentRequest;
import com.minutdel.dto.MockPaymentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @PostMapping("/mock-charge")
    public ResponseEntity<MockPaymentResponse> processMockPayment(@RequestBody MockPaymentRequest request) {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        if (request.isSimulateFailure()) {
            return ResponseEntity.badRequest().body(new MockPaymentResponse(
                    false,
                    null,
                    request.getPaymentMethod(),
                    "FAILED",
                    request.getAmount(),
                    "Payment simulation declined: Test card / bank rejected the transaction.",
                    nowStr
            ));
        }

        // Generate realistic transaction reference ID
        String txnId = "TXN_MOCK_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
                + "_" + (System.currentTimeMillis() % 10000);

        String method = (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank())
                ? request.getPaymentMethod()
                : "UPI";

        MockPaymentResponse response = new MockPaymentResponse(
                true,
                txnId,
                method,
                "PAID",
                request.getAmount(),
                "Mock payment of ₹" + request.getAmount() + " authorized successfully via " + method + ".",
                nowStr
        );

        return ResponseEntity.ok(response);
    }
}
