package com.auctonix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private Long auctionId;
    private Long buyerId;
    private BigDecimal amount;
    private LocalDateTime timestamp;
    private String paymentStatus;
    private String paymentMode;
    private String transactionId;
}
