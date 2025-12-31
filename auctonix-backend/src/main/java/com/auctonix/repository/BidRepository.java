package com.auctonix.repository;

import com.auctonix.model.Auction;
import com.auctonix.model.Bid;
import com.auctonix.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BidRepository extends JpaRepository<Bid,Long> {
    //get all bids for an auction
    List<Bid> findByAuctionOrderByAmountDesc(Auction auction);

    //get highest bid for an auction
    Optional<Bid> findFirstByAuctionOrderByAmountDesc(Auction auction);

    //get all bids by an user
    List<Bid> findByUser(User user);

    //get latest bid by user for an auction
    Optional<Bid> findFirstByAuctionAndUserOrderByTimestampDesc(Auction auction, User user);
}
