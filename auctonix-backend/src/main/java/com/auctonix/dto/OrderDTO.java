package com.auctonix.dto;

import com.auctonix.model.Order;
import com.auctonix.model.OrderStatus;
import com.auctonix.model.PaymentMode;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private String buyerName;
    private String buyerPhone;
    private String sellerName;
    private String sellerPhone;
    private BigDecimal amount;
    private OrderStatus status;
    private PaymentMode paymentMode;

    public static OrderDTO from(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .buyerName(order.getBuyer() != null ? order.getBuyer().getName() : null)
                .buyerPhone(order.getBuyer() != null ? order.getBuyer().getPhone() : null)
                .sellerName(order.getSeller() != null ? order.getSeller().getName() : null)
                .sellerPhone(order.getSeller() != null ? order.getSeller().getPhone() : null)
                .amount(order.getAmount())
                .status(order.getStatus())
                .paymentMode(order.getPaymentMode())
                .build();
    }
}
