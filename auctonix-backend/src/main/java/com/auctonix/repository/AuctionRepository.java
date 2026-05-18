package com.auctonix.repository;

import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.Product;
import com.auctonix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

    // Find auctions by status
    List<Auction> findByStatus(AuctionStatus status);

    @Query("""
        SELECT a FROM Auction a
        JOIN FETCH a.product p
        LEFT JOIN FETCH a.registeredUsers
        WHERE a.status = :status
    """)
    List<Auction> findByStatusWithProductAndUsers(AuctionStatus status);

    // Find auctions for a specific product
    Optional<Auction> findByProduct(Product product);

    // Find auctions a user is registered for
    List<Auction> findByRegisteredUsersContains(User user);

    // Optional: find upcoming auctions within a time range
    List<Auction> findByStatusAndStartTimeBetween(AuctionStatus status, LocalDateTime start, LocalDateTime end);

    @Query("""
        SELECT DISTINCT a FROM Auction a
        JOIN FETCH a.product p
        LEFT JOIN FETCH a.registeredUsers
        WHERE p.owner = :owner
    """)
    List<Auction> findByProduct_Owner(User owner);

    // to find live auctions that have ended
    @Query("""
        SELECT a FROM Auction a
        WHERE a.status = com.auctonix.model.AuctionStatus.LIVE
        AND a.endTime <= :now
    """)
    List<Auction> findLiveEnded(LocalDateTime now);
}
