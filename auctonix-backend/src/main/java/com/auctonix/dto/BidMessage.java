package com.auctonix.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BidMessage {
    private Long auctionId;
    private String userName;
    private BigDecimal amount;
    private boolean auctionEnded;
    private String winnerName;
}
