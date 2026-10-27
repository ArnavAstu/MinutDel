package com.minutdel.model;

public enum OrderStatus {
    PLACED("Order Received at Dark Store"),
    PACKING("Dark Store Picker is Packing Items"),
    RIDER_ASSIGNED("Delivery Partner Assigned & Waiting"),
    OUT_FOR_DELIVERY("Rider is on the Way (Speeding to your door)"),
    DELIVERED("Delivered in 10 mins! Enjoy!"),
    CANCELLED("Order Cancelled");

    private final String description;

    OrderStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
