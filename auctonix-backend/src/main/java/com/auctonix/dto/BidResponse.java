package com.auctonix.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BidResponse {
    private String userName;
    private BigDecimal amount;
    private LocalDateTime timestamp;
}
