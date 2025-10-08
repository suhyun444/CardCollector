package com.suhyun444.cardcollector.Parser;

import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;

import com.suhyun444.cardcollector.DTO.TransactionRequestDto;
import com.suhyun444.cardcollector.Entity.Transaction;

public abstract class TransactionParser {
    abstract public List<Transaction> parse(Sheet sheet);
}
