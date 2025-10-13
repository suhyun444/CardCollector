package com.suhyun444.cardcollector.DTO;

import com.suhyun444.cardcollector.Entity.Transaction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRequestDto {
    private String id;
    private String date;
    private String merchant;
    private int amount;
    private String category;
    private String description;
    private PaymentStatus status;
    private String paymentMethod;

     public static TransactionRequestDto from(Transaction transaction) {
        return new TransactionRequestDto(
            String.valueOf(transaction.getId()),
            transaction.getDate(),
            transaction.getMerchant(),
            transaction.getAmount(),
            transaction.getCategory(),
            transaction.getDescription(),
            transaction.getStatus(),
            transaction.getPaymentMethod()
        );
    }
}
