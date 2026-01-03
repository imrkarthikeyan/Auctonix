package com.auctonix.service;

import com.auctonix.exception.CustomException;
import com.auctonix.model.Auction;
import com.auctonix.model.Transaction;
import com.auctonix.model.User;
import com.auctonix.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final TransactionRepository transactionRepository;
    private final AuctionService auctionService;

    // to create payment transaction
    public Transaction createTransaction(Long auctionId, User buyer, BigDecimal amount, String paymentMode) {
        Auction auction = auctionService.getAuctionById(auctionId);

        if (auction.getStatus() != com.auctonix.model.AuctionStatus.LIVE){
            throw new CustomException("Auction is not live for payment");
        }

        Transaction transaction = Transaction.builder()
                .auction(auction)
                .buyer(buyer)
                .amount(amount)
                .timestamp(LocalDateTime.now())
                .paymentStatus("PENDING")
                .paymentMode(paymentMode)
                .build();

        return transactionRepository.save(transaction);
    }


    // to update payment status
    public Transaction updatePaymentStatus(Long transactionId, String status, String transactionIdFromGateway) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new CustomException("Transaction not found"));

        transaction.setPaymentStatus(status);
        transaction.setTransactionId(transactionIdFromGateway);

        if ("SUCCESS".equalsIgnoreCase(status)) {
            // to update auction/product status as SOLD
            auctionService.markAuctionAsSold(transaction.getAuction(), transaction.getBuyer());
        }

        return transactionRepository.save(transaction);
    }


    // to get transactions for user
    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByBuyer(user);
    }


    // to get transactions for auction
    public List<Transaction> getTransactionsByAuction(Long auctionId) {
        Auction auction = auctionService.getAuctionById(auctionId);
        return transactionRepository.findByAuction(auction);
    }
}
