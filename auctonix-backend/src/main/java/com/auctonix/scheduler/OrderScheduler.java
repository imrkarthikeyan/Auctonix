package com.auctonix.scheduler;

import com.auctonix.model.Order;
import com.auctonix.model.OrderStatus;
import com.auctonix.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class OrderScheduler {
    private final OrderRepository orderRepo;

    public OrderScheduler(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }
    @Scheduled(fixedRate = 60000) // runs every 1 minute
    public void autoDeliver() {
        List<Order> paidOrders = orderRepo.findByStatus(OrderStatus.PAID);

        for (Order order : paidOrders) {
            if (order.getPaidAt().plusHours(1)
                    .isBefore(LocalDateTime.now())) {

                order.setStatus(OrderStatus.DELIVERED);
                order.setDeliveredAt(LocalDateTime.now());
                orderRepo.save(order);
            }
        }
    }
}
