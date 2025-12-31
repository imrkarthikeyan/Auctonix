package com.auctonix.service;

import com.auctonix.exception.CustomException;
import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.Bid;
import com.auctonix.model.User;
import com.auctonix.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BidService {
    private final BidRepository bidRepository;
    private final AuctionService auctionService;

    //to new bid
    public Bid placeBid(Long auctionId, User user, BigDecimal amount){
        Auction auction = auctionService.getAuctionById(auctionId);
        if(auction.getStatus()!= AuctionStatus.LIVE){
            throw new CustomException("Auction is not live");
        }

        BigDecimal basePrice = auction.getProduct().getBasePrice();
        BigDecimal highestBid=bidRepository.findFirstByAuctionOrderByAmountDesc(auction)
                .map(Bid::getAmount)
                .orElse(basePrice);
        BigDecimal minIncrement=BigDecimal.valueOf(1000); //example increment
        BigDecimal requiredMin=highestBid.add(minIncrement);

        if(amount.compareTo(requiredMin)<0){
            throw new CustomException("Bid amount must be at least "+requiredMin);
        }

        Bid bid= Bid.builder()
                .auction(auction)
                .user(user)
                .amount(amount)
                .timestamp(LocalDateTime.now())
                .build();
        return bidRepository.save(bid);
    }

    //get bid history for an auction
    public List<Bid> getBidsForAuction(Long auctionId){
        Auction auction=auctionService.getAuctionById(auctionId);
        return bidRepository.findByAuctionOrderByAmountDesc(auction);
    }

    //get highest bid for an auction
    public Bid getHighestBidForAuction(Long auctionId){
        Auction auction=auctionService.getAuctionById(auctionId);
        return bidRepository.findFirstByAuctionOrderByAmountDesc(auction)
                .orElse(null);
    }

    //get bids by user
    public List<Bid> getBidsByUser(User user){
        return bidRepository.findByUser(user);
    }
}
