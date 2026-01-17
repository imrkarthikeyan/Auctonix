package com.auctonix.controller;

import com.auctonix.dto.OrderDTO;
import com.auctonix.model.PaymentMode;
import com.auctonix.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/auction/{auctionId}")
    public OrderDTO getOrder(@PathVariable Long auctionId) {
        return orderService.getByAuction(auctionId);
    }

    @PostMapping("/{orderId}/confirm")
    public void confirmOrder(@PathVariable Long orderId) {
        orderService.confirmOrder(orderId);
    }

    @PostMapping("/{orderId}/pay")
    public void pay(
            @PathVariable Long orderId,
            @RequestParam PaymentMode mode
    ) {
        orderService.pay(orderId, mode);
    }
}
