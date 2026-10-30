package com.minutdel.dto;

import java.math.BigDecimal;

public class MockPaymentRequest {
    private BigDecimal amount;
    private String paymentMethod;  // UPI, CARD, NETBANKING
    private String paymentDetails; // e.g. VPA id or masked card
    private String customerEmail;
    private boolean simulateFailure;

    public MockPaymentRequest() {}

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentDetails() {
        return paymentDetails;
    }

    public void setPaymentDetails(String paymentDetails) {
        this.paymentDetails = paymentDetails;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public boolean isSimulateFailure() {
        return simulateFailure;
    }

    public void setSimulateFailure(boolean simulateFailure) {
        this.simulateFailure = simulateFailure;
    }
}
