package com.auctonix.controller;

import com.auctonix.dto.BidRequest;
import com.auctonix.model.Bid;
import com.auctonix.model.User;
import com.auctonix.service.BidService;
import com.auctonix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
//@CrossOrigin(origins="*")
public class BidController {
    private final BidService bidService;
    private final UserService userService;

    //to bid
    @PostMapping("/place")
    public ResponseEntity<Bid> placeBid(@RequestBody BidRequest request){
        User user= userService.getUserById(request.getUserId());
        Bid bid= bidService.placeBid(request.getAuctionId(), user, request.getAmount());
        return ResponseEntity.ok(bid);
    }

    //get bid history for auction
    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<Bid>> getBidsForAuction(@PathVariable Long auctionId){
        List<Bid> bids= bidService.getBidsForAuction(auctionId);
        return ResponseEntity.ok(bids);
    }

    //get highest bid for auction
    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<Bid> getHighestBid(@PathVariable Long auctionId){
        Bid bid= bidService.getHighestBidForAuction(auctionId);
        return ResponseEntity.ok(bid);
    }

    //get bids by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bid>> getBidsByUser(@PathVariable Long userId){
        User user= userService.getUserById(userId);
        List<Bid> bids= bidService.getBidsByUser(user);
        return ResponseEntity.ok(bids);
    }
}
