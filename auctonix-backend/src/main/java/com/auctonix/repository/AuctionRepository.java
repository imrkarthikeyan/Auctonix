package com.auctonix.repository;

import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.Product;
import com.auctonix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction,Long> {

    //Find auctions by status
    List<Auction> findByStatus(AuctionStatus status);

    //Find auctions for a specific product
    Optional<Auction> findByProduct(Product product);


    //Find auctions a user is registered for
    List<Auction> findByRegisteredUsersContains(User user);

    //find upcoming auctions within a time range
    List<Auction> findByStatusAndStartTimeBetween(AuctionStatus status, LocalDateTime start, LocalDateTime end);
}
