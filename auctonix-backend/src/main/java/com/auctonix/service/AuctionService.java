package com.auctonix.service;

import com.auctonix.exception.CustomException;
import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.Product;
import com.auctonix.model.ProductStatus;
import com.auctonix.model.User;
import com.auctonix.repository.AuctionRepository;
import com.auctonix.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionService {
    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;

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
    public List<Auction> getAuctionsByStatus(AuctionStatus status) {
        return auctionRepository.findByStatus(status);
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

        return auctionRepository.save(auction);
    }

    // for successful payment
    public Auction markAuctionAsSold(Auction auction, User buyer) {
        auction.setStatus(AuctionStatus.ENDED); // auction ended
        auction.getProduct().setStatus(ProductStatus.SOLD); // product sold
        productRepository.save(auction.getProduct());
        return auctionRepository.save(auction);
    }
}
