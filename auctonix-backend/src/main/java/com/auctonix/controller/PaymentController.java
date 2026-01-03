package com.auctonix.controller;

import com.auctonix.dto.TransactionDTO;
import com.auctonix.model.Transaction;
import com.auctonix.model.User;
import com.auctonix.service.PaymentService;
import com.auctonix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService    userService;

    private TransactionDTO toDTO(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .auctionId(t.getAuction().getId())
                .buyerId(t.getBuyer().getId())
                .amount(t.getAmount())
                .timestamp(t.getTimestamp())
                .paymentStatus(t.getPaymentStatus())
                .paymentMode(t.getPaymentMode())
                .transactionId(t.getTransactionId())
                .build();
    }

    @PostMapping("/initiate")
    public ResponseEntity<TransactionDTO> initiatePayment(
            @RequestParam Long auctionId,
            @RequestParam Long userId,
            @RequestParam BigDecimal amount,
            @RequestParam String paymentMode
    ) {
        User user = userService.getUserById(userId);
        Transaction transaction = paymentService.createTransaction(auctionId, user, amount, paymentMode);
        return ResponseEntity.ok(toDTO(transaction));
    }

    @PostMapping("/confirm")
    public ResponseEntity<TransactionDTO> confirmPayment(
            @RequestParam Long transactionId,
            @RequestParam String status,
            @RequestParam(required = false) String gatewayTransactionId
    ) {
        Transaction transaction = paymentService.updatePaymentStatus(transactionId, status, gatewayTransactionId);
        return ResponseEntity.ok(toDTO(transaction));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDTO>> getUserTransactions(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        List<TransactionDTO> dtos = paymentService.getTransactionsByUser(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<List<TransactionDTO>> getAuctionTransactions(@PathVariable Long auctionId) {
        List<TransactionDTO> dtos = paymentService.getTransactionsByAuction(auctionId)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
