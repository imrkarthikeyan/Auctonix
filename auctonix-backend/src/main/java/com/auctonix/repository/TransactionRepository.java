package com.auctonix.repository;

import com.auctonix.model.Auction;
import com.auctonix.model.Transaction;
import com.auctonix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    // Get all transactions for a specific auction
    List<Transaction> findByAuction(Auction auction);

    // Get all transactions for a specific user
    List<Transaction> findByBuyer(User buyer);

    // Optional: find transaction by auction and buyer
    Transaction findFirstByAuctionAndBuyer(Auction auction, User buyer);
}
