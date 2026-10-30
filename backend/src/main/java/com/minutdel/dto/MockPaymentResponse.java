package com.minutdel.dto;

import java.math.BigDecimal;

public class MockPaymentResponse {
    private boolean success;
    private String transactionId;
    private String paymentMethod;
    private String status; // "PAID" or "FAILED"
    private BigDecimal amount;
    private String message;
    private String gatewayName = "MinutDel MockPay Gateway (AWS Sandbox)";
    private String timestamp;

    public MockPaymentResponse() {}

    public MockPaymentResponse(boolean success, String transactionId, String paymentMethod,
                               String status, BigDecimal amount, String message, String timestamp) {
        this.success = success;
        this.transactionId = transactionId;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.amount = amount;
        this.message = message;
        this.timestamp = timestamp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getGatewayName() {
        return gatewayName;
    }

    public void setGatewayName(String gatewayName) {
        this.gatewayName = gatewayName;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
