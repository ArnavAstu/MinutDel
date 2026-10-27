package com.minutdel.service;

import com.minutdel.model.Order;
import com.minutdel.model.OrderStatus;
import com.minutdel.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
public class OrderSimulationService {

    private static final Logger log = LoggerFactory.getLogger(OrderSimulationService.class);

    private final OrderRepository orderRepository;
    private final Random random = new Random();

    private final String[] RIDERS = {
            "Amit Sharma (+91 98711-22334)",
            "Rahul Verma (+91 98102-33445)",
            "Deepak Kumar (+91 99114-55667)",
            "Sandeep Yadav (+91 97180-66778)"
    };

    public OrderSimulationService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Async
    public void simulateOrderLifecycle(Long orderId) {
        log.info("Starting Quick Commerce Delivery Simulation for Order #{}", orderId);
        String assignedRider = RIDERS[random.nextInt(RIDERS.length)];

        try {
            // Stage 1: Wait 5 seconds -> PACKING
            Thread.sleep(5000);
            updateOrderStatus(orderId, OrderStatus.PACKING, null, null, 8);

            // Stage 2: Wait 6 seconds -> RIDER_ASSIGNED
            Thread.sleep(6000);
            String[] parts = assignedRider.split(" \\(");
            String riderName = parts[0];
            String riderPhone = parts.length > 1 ? parts[1].replace(")", "") : "+91 98765-43210";
            updateOrderStatus(orderId, OrderStatus.RIDER_ASSIGNED, riderName, riderPhone, 6);

            // Stage 3: Wait 6 seconds -> OUT_FOR_DELIVERY
            Thread.sleep(6000);
            updateOrderStatus(orderId, OrderStatus.OUT_FOR_DELIVERY, riderName, riderPhone, 3);

            // Stage 4: Wait 8 seconds -> DELIVERED
            Thread.sleep(8000);
            updateOrderStatus(orderId, OrderStatus.DELIVERED, riderName, riderPhone, 0);

            log.info("Order #{} simulated delivery cycle COMPLETE!", orderId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Simulation interrupted for Order #{}", orderId, e);
        } catch (Exception e) {
            log.error("Simulation error for Order #{}: {}", orderId, e.getMessage());
        }
    }

    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus status, String riderName, String riderPhone, int minutesRemaining) {
        orderRepository.findById(orderId).ifPresent(order -> {
            if (order.getStatus() != OrderStatus.CANCELLED) {
                order.setStatus(status);
                order.setEstimatedMinutesRemaining(minutesRemaining);
                if (riderName != null) order.setRiderName(riderName);
                if (riderPhone != null) order.setRiderPhone(riderPhone);
                orderRepository.save(order);
                log.info("[Order #{}] Status updated to: {} (ETA: {} mins)", orderId, status, minutesRemaining);
            }
        });
    }
}
