package com.suhyun444.cardcollector;

import lombok.AllArgsConstructor;
import lombok.Data;

enum PaymentStatus{
    completed,
    pending,
    failed
};


@Data
@AllArgsConstructor
public class TransactionResponseDto {
    private String id;
    private String date;
    private String merchant;
    private int amount;
    private String category;
    private String description;
    private PaymentStatus status;
    private String paymentMethod;
}
