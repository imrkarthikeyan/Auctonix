package com.auctonix.service;

import com.auctonix.dto.OrderDTO;
import com.auctonix.model.Order;
import com.auctonix.model.OrderStatus;
import com.auctonix.repository.BidRepository;
import com.auctonix.repository.OrderRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.auctonix.dto.BidMessage;
import com.auctonix.exception.CustomException;
import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.Bid;
import com.auctonix.model.Product;
import com.auctonix.model.ProductStatus;
import com.auctonix.model.User;
import com.auctonix.repository.AuctionRepository;
import com.auctonix.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final BidRepository bidRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final OrderRepository orderRepository;

    //to create new auction
    public Auction createAuction(Long productId, LocalDateTime startTime, LocalDateTime endTime) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException("Product not found"));

        // Check if product already has an auction
        auctionRepository.findByProduct(product).ifPresent(a -> {
            throw new CustomException("Product already has an active auction");
        });

        Auction auction = Auction.builder()
                .product(product)
                .startTime(startTime)
                .endTime(endTime)
                .status(AuctionStatus.UPCOMING)
                .build();

        return auctionRepository.save(auction);
    }

    //get auction by id
    public Auction getAuctionById(Long id) {
        return auctionRepository.findById(id)
                .orElseThrow(() -> new CustomException("Auction not found"));
    }

    //register user for auction
    public Auction registerUser(Long auctionId, User user) {
        Auction auction = getAuctionById(auctionId);
        auction.getRegisteredUsers().add(user);
        return auctionRepository.save(auction);
    }

    //get auctions by status
    @Transactional(readOnly = true)
    public List<Auction> getAuctionsByStatus(AuctionStatus status) {
        // use fetch-join to avoid repeated product/user queries (N+1)
        return auctionRepository.findByStatusWithProductAndUsers(status);
    }

    // get auctions for a specific user
    public List<Auction> getAuctionsForUser(User user) {
        return auctionRepository.findByRegisteredUsersContains(user);
    }

    //update auction status
    public Auction updateAuctionStatus(Long auctionId, AuctionStatus status) {
        Auction auction = getAuctionById(auctionId);
        auction.setStatus(status);
        return auctionRepository.save(auction);
    }

    // end the auction after inactivity
    public Auction endAuction(Long auctionId) {
        Auction auction = getAuctionById(auctionId);
        auction.setStatus(AuctionStatus.ENDED);

        // Update final product status as SOLD
        auction.getProduct().setStatus(ProductStatus.SOLD);
        productRepository.save(auction.getProduct());

        Bid highest = bidRepository
                .findFirstByAuctionOrderByAmountDesc(auction)
                .orElse(null);

        if (highest != null) {
            Order order = new Order();
            order.setAuction(auction);
            order.setBuyer(highest.getUser());
            order.setSeller(auction.getProduct().getOwner());
            order.setAmount(highest.getAmount());
            order.setStatus(OrderStatus.PENDING_CONFIRMATION);

            orderRepository.save(order);
        }

        return auctionRepository.save(auction);
    }

    public OrderDTO getByAuction(Long auctionId) {
        Order order = orderRepository.findByAuctionId(auctionId)
                .orElseThrow(() -> new CustomException("Order not found"));

        return OrderDTO.from(order); // adjust if your mapping is different
    }

    // for successful payment
    public Auction markAuctionAsSold(Auction auction, User buyer) {
        auction.setStatus(AuctionStatus.ENDED); // auction ended
        auction.getProduct().setStatus(ProductStatus.SOLD); // product sold
        productRepository.save(auction.getProduct());
        return auctionRepository.save(auction);
    }

    public List<Auction> getAuctionsCreatedByUser(User user) {
        return auctionRepository.findByProduct_Owner(user);
    }

    @Scheduled(fixedRate = 5000)
    public void endAuctions() {

        List<Auction> ended = auctionRepository
                .findLiveEnded(LocalDateTime.now());

        for (Auction auction : ended) {

            auction.setStatus(AuctionStatus.ENDED);
            auctionRepository.save(auction);

            Bid highest = bidRepository
                    .findFirstByAuctionOrderByAmountDesc(auction)
                    .orElse(null);
            messagingTemplate.convertAndSend(
                    "/topic/auction/" + auction.getId(),
                    new BidMessage(
                            auction.getId(),
                            highest != null ? highest.getUser().getName() : null,
                            highest != null ? highest.getAmount() : null,
                            true,
                            highest != null ? highest.getUser().getName() : "No bids"
                    )
            );

        }
    }

    @Scheduled(fixedRate = 5000) // every 5 seconds
    public void updateAuctionStatuses() {

        LocalDateTime now = LocalDateTime.now();

        // UPCOMING → LIVE
        List<Auction> toLive = auctionRepository.findAll().stream()
                .filter(a -> a.getStatus() == AuctionStatus.UPCOMING)
                .filter(a -> !a.getStartTime().isAfter(now))
                .toList();

        for (Auction auction : toLive) {
            auction.setStatus(AuctionStatus.LIVE);
            auctionRepository.save(auction);
        }

        // LIVE → ENDED
//        List<Auction> toEnd = auctionRepository.findLiveEnded(now);
//
//        for (Auction auction : toEnd) {
//            auction.setStatus(AuctionStatus.ENDED);
//            auctionRepository.save(auction);
//        }
        // LIVE → ENDED
        List<Auction> toEnd = auctionRepository.findLiveEnded(now);

        for (Auction auction : toEnd) {

            auction.setStatus(AuctionStatus.ENDED);
            auctionRepository.save(auction);

            Bid highest = bidRepository
                    .findFirstByAuctionOrderByAmountDesc(auction)
                    .orElse(null);

            if (highest != null) {
                Order order = new Order();
                order.setAuction(auction);
                order.setBuyer(highest.getUser());
                order.setSeller(auction.getProduct().getOwner());
                order.setAmount(highest.getAmount());
                order.setStatus(OrderStatus.PENDING_CONFIRMATION);

                orderRepository.save(order);
            }
        }

    }
}
