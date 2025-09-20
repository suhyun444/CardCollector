package com.suhyun444.cardcollector.Parser;

import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;

import com.suhyun444.cardcollector.DTO.TransactionRequestDto;

public abstract class TransactionParser {
    abstract public List<TransactionRequestDto> Parse(Sheet sheet);
}
