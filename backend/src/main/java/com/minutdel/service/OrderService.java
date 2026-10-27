package com.minutdel.service;

import com.minutdel.dto.OrderItemRequest;
import com.minutdel.dto.OrderRequest;
import com.minutdel.model.Order;
import com.minutdel.model.OrderItem;
import com.minutdel.model.OrderStatus;
import com.minutdel.model.Product;
import com.minutdel.repository.OrderRepository;
import com.minutdel.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderSimulationService orderSimulationService;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        OrderSimulationService orderSimulationService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderSimulationService = orderSimulationService;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setContactNumber(request.getContactNumber());
        order.setStatus(OrderStatus.PLACED);
        order.setEstimatedMinutesRemaining(10);
        order.setDarkStoreLocation("DarkStore #07 - Sector 62 Hub");

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalStateException("Insufficient stock for product: " + product.getName());
            }

            // Deduct stock for quick commerce real-time inventory
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(order, product, itemReq.getQuantity(), product.getPrice());
            order.addItem(orderItem);
            total = total.add(orderItem.getSubtotal());
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        // Kick off asynchronous delivery simulation
        orderSimulationService.simulateOrderLifecycle(savedOrder.getId());

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public boolean cancelOrder(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if (order.getStatus() == OrderStatus.PLACED || order.getStatus() == OrderStatus.PACKING) {
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
                return true;
            }
        }
        return false;
    }
}
