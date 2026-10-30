package com.minutdel.service;

import com.minutdel.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class OrderStreamService {

    private static final Logger log = LoggerFactory.getLogger(OrderStreamService.class);
    
    // Active SSE client subscriptions keyed by orderId
    private final Map<Long, List<SseEmitter>> orderEmitters = new ConcurrentHashMap<>();

    // 5-minute timeout for live delivery tracking sessions
    private static final Long EMITTER_TIMEOUT = 5 * 60 * 1000L;

    public SseEmitter subscribeToOrder(Long orderId, Order initialOrder) {
        SseEmitter emitter = new SseEmitter(EMITTER_TIMEOUT);
        
        orderEmitters.computeIfAbsent(orderId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(orderId, emitter));
        emitter.onTimeout(() -> removeEmitter(orderId, emitter));
        emitter.onError((e) -> removeEmitter(orderId, emitter));

        // Push initial state immediately on connection
        if (initialOrder != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("order-init")
                        .data(initialOrder));
            } catch (IOException e) {
                removeEmitter(orderId, emitter);
            }
        }

        log.info("Client subscribed to SSE live stream for Order #{}", orderId);
        return emitter;
    }

    public void broadcastOrderUpdate(Order order) {
        if (order == null || order.getId() == null) return;
        
        Long orderId = order.getId();
        List<SseEmitter> emitters = orderEmitters.get(orderId);

        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("order-update")
                        .data(order));
            } catch (IOException | IllegalStateException e) {
                removeEmitter(orderId, emitter);
            }
        }
        log.info("Pushed SSE real-time update for Order #{} [Status: {}]", orderId, order.getStatus());
    }

    private void removeEmitter(Long orderId, SseEmitter emitter) {
        List<SseEmitter> list = orderEmitters.get(orderId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) {
                orderEmitters.remove(orderId);
            }
        }
    }
}
