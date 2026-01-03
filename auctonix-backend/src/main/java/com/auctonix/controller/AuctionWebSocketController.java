package com.auctonix.controller;


import com.auctonix.dto.BidMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AuctionWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    // to recieve bid from client and broadcast
    @MessageMapping("/bid.send")
    public void sendBid(BidMessage bidMessage) {
        // Broadcast to all subscribers of this auction
        messagingTemplate.convertAndSend(
                "/topic/auction/" + bidMessage.getAuctionId(),
                bidMessage
        );
    }
}
