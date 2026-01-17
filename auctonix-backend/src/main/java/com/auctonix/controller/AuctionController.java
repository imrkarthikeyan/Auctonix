package com.auctonix.controller;

import com.auctonix.dto.AuctionDTO;
import com.auctonix.dto.BidMessage;
import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.Bid;
import com.auctonix.model.User;
import com.auctonix.repository.BidRepository;
import com.auctonix.service.AuctionService;
import com.auctonix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class AuctionController {

    private final AuctionService auctionService;
    private final UserService userService;
    private final BidRepository bidRepository;


    private AuctionDTO toDTO(Auction auction) {

        Bid highest = null;
        if (auction.getStatus() == AuctionStatus.ENDED) {
            highest = bidRepository
                    .findFirstByAuctionOrderByAmountDesc(auction)
                    .orElse(null);
        }

        return AuctionDTO.builder()
                .id(auction.getId())
                .productId(auction.getProduct().getId())
                .productName(auction.getProduct().getName())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .status(auction.getStatus())
//                .registeredUserIds(auction.getRegisteredUsers().stream()
//                        .map(u -> u.getId()).collect(Collectors.toSet()))
                .registeredUserIds(
                        auction.getRegisteredUsers()
                                .stream().map(User::getId).collect(Collectors.toSet())
                )
                .winnerName(highest != null ? highest.getUser().getName() : null)
                .winningAmount(highest != null ? highest.getAmount() : null)
                .build();
    }

//    @PostMapping("/create")
//    public ResponseEntity<AuctionDTO> createAuction(
//            @RequestParam Long productId,
//            @RequestParam String startTime,
//            @RequestParam String endTime) {
//
//        LocalDateTime start = LocalDateTime.parse(startTime);
//        LocalDateTime end = LocalDateTime.parse(endTime);
//
//        Auction auction = auctionService.createAuction(productId, start, end);
//        return ResponseEntity.ok(toDTO(auction));
//    }

    @PostMapping("/create")
    public ResponseEntity<AuctionDTO> createAuction(
            @RequestParam Long productId,
            @RequestParam String startTime,
            @RequestParam String endTime) {

        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);

        Auction auction = auctionService.createAuction(productId, start, end);

        // 🔥 Reload auction fully from DB
        Auction freshAuction = auctionService.getAuctionById(auction.getId());

        return ResponseEntity.ok(toDTO(freshAuction));
    }


    @PostMapping("/{auctionId}/register")
    public ResponseEntity<AuctionDTO> registerUser(
            @PathVariable Long auctionId,
            @RequestParam Long userId) {

        User user = userService.getUserById(userId);
        Auction auction = auctionService.registerUser(auctionId, user);
        return ResponseEntity.ok(toDTO(auction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionDTO> getAuctionById(@PathVariable Long id) {
        Auction auction = auctionService.getAuctionById(id);
        return ResponseEntity.ok(toDTO(auction));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AuctionDTO>> getAuctionsByStatus(@PathVariable AuctionStatus status) {
        List<AuctionDTO> dtos = auctionService.getAuctionsByStatus(status)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuctionDTO>> getAuctionsForUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        List<AuctionDTO> dtos = auctionService.getAuctionsForUser(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{auctionId}/end")
    public ResponseEntity<AuctionDTO> endAuction(@PathVariable Long auctionId) {
        Auction auction = auctionService.endAuction(auctionId);
        return ResponseEntity.ok(toDTO(auction));
    }

    @GetMapping("/created-by/{userId}")
    public ResponseEntity<List<AuctionDTO>> getAuctionsCreatedByUser(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(
                auctionService.getAuctionsCreatedByUser(user)
                        .stream().map(this::toDTO).toList()
        );

    }
}