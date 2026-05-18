package com.auctonix.service;

import com.auctonix.dto.BidMessage;
import com.auctonix.dto.BidResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;

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
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionService auctionService;
    private final SimpMessagingTemplate messagingTemplate;

    //to new bid
    @Transactional
    public Bid placeBid(Long auctionId, User user, BigDecimal amount) {

        Auction auction = auctionService.getAuctionById(auctionId);

        if (auction.getStatus() != AuctionStatus.LIVE) {
            throw new CustomException("Auction is not live");
        }

        BigDecimal highest = bidRepository
                .findFirstByAuctionOrderByAmountDesc(auction)
                .map(Bid::getAmount)
                .orElse(auction.getProduct().getBasePrice());

        BigDecimal minIncrement = BigDecimal.valueOf(100);

        if (amount.compareTo(highest.add(minIncrement)) < 0) {
            throw new CustomException("Bid must be at least " + highest.add(minIncrement));
        }

        Bid bid = Bid.builder()
                .auction(auction)
                .user(user)
                .amount(amount)
                .timestamp(LocalDateTime.now())
                .build();

        bidRepository.save(bid);

        // broadcast after save
        messagingTemplate.convertAndSend(
                "/topic/auction/" + auctionId,
                new BidMessage(
                        auctionId,
                        user.getName(),
                        amount,
                        false,
                        null
                )
        );

        return bid;
    }

    //get bid history for an auction
    @Transactional
    public List<BidResponse> getBidsForAuction(Long auctionId) {
        Auction auction = auctionService.getAuctionById(auctionId);

        return bidRepository.findByAuctionOrderByAmountDesc(auction)
                .stream()
                .map(b -> new BidResponse(
                b.getUser().getName(),
                b.getAmount(),
                b.getTimestamp()
        ))
                .toList();
    }

    //get highest bid for an auction
    @Transactional
    public Bid getHighestBid(Long auctionId) {
        Auction auction = auctionService.getAuctionById(auctionId);
        return bidRepository.findFirstByAuctionOrderByAmountDesc(auction)
                .orElse(null);
    }

    //get bids by user
    public List<Bid> getBidsByUser(User user) {
        return bidRepository.findByUser(user);
    }
}
