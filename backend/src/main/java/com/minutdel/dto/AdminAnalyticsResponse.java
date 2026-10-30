package com.minutdel.dto;

import com.minutdel.model.Order;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminAnalyticsResponse {

    private long totalOrders;
    private BigDecimal totalRevenue;
    private double averageOrderValue;
    private long deliveredOrders;
    private long activeOrders;
    private long cancelledOrders;
    private double cancellationRate;
    private Map<String, Long> statusBreakdown;
    private List<TopProductDto> popularProducts;
    private List<Order> recentOrders;

    public AdminAnalyticsResponse() {}

    public AdminAnalyticsResponse(long totalOrders, BigDecimal totalRevenue, double averageOrderValue,
                                  long deliveredOrders, long activeOrders, long cancelledOrders,
                                  double cancellationRate, Map<String, Long> statusBreakdown,
                                  List<TopProductDto> popularProducts, List<Order> recentOrders) {
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.averageOrderValue = averageOrderValue;
        this.deliveredOrders = deliveredOrders;
        this.activeOrders = activeOrders;
        this.cancelledOrders = cancelledOrders;
        this.cancellationRate = cancellationRate;
        this.statusBreakdown = statusBreakdown;
        this.popularProducts = popularProducts;
        this.recentOrders = recentOrders;
    }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public double getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public long getDeliveredOrders() { return deliveredOrders; }
    public void setDeliveredOrders(long deliveredOrders) { this.deliveredOrders = deliveredOrders; }

    public long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(long activeOrders) { this.activeOrders = activeOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public double getCancellationRate() { return cancellationRate; }
    public void setCancellationRate(double cancellationRate) { this.cancellationRate = cancellationRate; }

    public Map<String, Long> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(Map<String, Long> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public List<TopProductDto> getPopularProducts() { return popularProducts; }
    public void setPopularProducts(List<TopProductDto> popularProducts) { this.popularProducts = popularProducts; }

    public List<Order> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<Order> recentOrders) { this.recentOrders = recentOrders; }
}
