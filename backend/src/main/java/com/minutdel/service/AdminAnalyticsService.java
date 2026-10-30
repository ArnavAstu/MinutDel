package com.minutdel.service;

import com.minutdel.dto.AdminAnalyticsResponse;
import com.minutdel.dto.TopProductDto;
import com.minutdel.model.Order;
import com.minutdel.model.OrderStatus;
import com.minutdel.repository.OrderItemRepository;
import com.minutdel.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class AdminAnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public AdminAnalyticsService(OrderRepository orderRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public AdminAnalyticsResponse getDashboardAnalytics() {
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        Double avgOrderVal = orderRepository.calculateAverageOrderValue();

        long delivered = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelled = orderRepository.countByStatus(OrderStatus.CANCELLED);
        long placed = orderRepository.countByStatus(OrderStatus.PLACED);
        long packing = orderRepository.countByStatus(OrderStatus.PACKING);
        long riderAssigned = orderRepository.countByStatus(OrderStatus.RIDER_ASSIGNED);
        long outForDelivery = orderRepository.countByStatus(OrderStatus.OUT_FOR_DELIVERY);

        long activeOrders = placed + packing + riderAssigned + outForDelivery;
        double cancellationRate = totalOrders > 0 ? ((double) cancelled * 100.0) / totalOrders : 0.0;

        Map<String, Long> statusMap = new LinkedHashMap<>();
        statusMap.put("PLACED", placed);
        statusMap.put("PACKING", packing);
        statusMap.put("RIDER_ASSIGNED", riderAssigned);
        statusMap.put("OUT_FOR_DELIVERY", outForDelivery);
        statusMap.put("DELIVERED", delivered);
        statusMap.put("CANCELLED", cancelled);

        // Fetch actual top selling products from database
        List<Object[]> rawTop = orderItemRepository.findTopSellingProducts();
        List<TopProductDto> popularProducts = new ArrayList<>();

        for (Object[] row : rawTop) {
            Long prodId = (Long) row[0];
            String prodName = (String) row[1];
            Long totalQty = ((Number) row[2]).longValue();
            BigDecimal prodRevenue = (BigDecimal) row[3];
            popularProducts.add(new TopProductDto(prodId, prodName, totalQty, prodRevenue));
            if (popularProducts.size() >= 5) break; // Top 5
        }

        List<Order> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc();
        if (recentOrders.size() > 8) {
            recentOrders = recentOrders.subList(0, 8);
        }

        return new AdminAnalyticsResponse(
                totalOrders,
                totalRevenue,
                avgOrderVal != null ? avgOrderVal : 0.0,
                delivered,
                activeOrders,
                cancelled,
                cancellationRate,
                statusMap,
                popularProducts,
                recentOrders
        );
    }
}
