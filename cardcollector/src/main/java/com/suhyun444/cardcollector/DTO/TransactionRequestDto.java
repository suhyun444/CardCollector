package com.suhyun444.cardcollector.DTO;

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
    private String paymentMethod;
}
