package com.suhyun444.cardcollector.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;


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
