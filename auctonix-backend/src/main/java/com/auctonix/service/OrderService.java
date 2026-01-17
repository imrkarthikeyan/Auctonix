package com.auctonix.service;

import com.auctonix.dto.OrderDTO;
import com.auctonix.model.Order;
import com.auctonix.model.OrderStatus;
import com.auctonix.model.PaymentMode;
import com.auctonix.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    public void confirmOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.CONFIRMED);
        order.setConfirmedAt(LocalDateTime.now());
        orderRepo.save(order);
    }

    public void pay(Long orderId, PaymentMode mode) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setPaymentMode(mode);
        order.setStatus(OrderStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        orderRepo.save(order);
    }

    public OrderDTO getByAuction(Long auctionId) {
        Order order = orderRepo.findByAuctionId(auctionId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return OrderDTO.from(order);
    }

}
