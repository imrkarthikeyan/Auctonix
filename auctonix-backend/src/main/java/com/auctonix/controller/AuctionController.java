package com.auctonix.controller;

import com.auctonix.dto.AuctionDTO;
import com.auctonix.model.Auction;
import com.auctonix.model.AuctionStatus;
import com.auctonix.model.User;
import com.auctonix.service.AuctionService;
import com.auctonix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
public class AuctionController {
    private final AuctionService auctionService;
    private final UserService    userService;

    private AuctionDTO toDTO(Auction auction) {
        return AuctionDTO.builder()
                .id(auction.getId())
                .productId(auction.getProduct().getId())
                .productName(auction.getProduct().getName())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .status(auction.getStatus())
                .registeredUserIds(auction.getRegisteredUsers().stream()
                        .map(u -> u.getId()).collect(Collectors.toSet()))
                .build();
    }

    @PostMapping("/create")
    public ResponseEntity<AuctionDTO> createAuction(
            @RequestParam Long productId,
            @RequestParam String startTime,
            @RequestParam String endTime) {

        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);

        Auction auction = auctionService.createAuction(productId, start, end);
        return ResponseEntity.ok(toDTO(auction));
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
}
