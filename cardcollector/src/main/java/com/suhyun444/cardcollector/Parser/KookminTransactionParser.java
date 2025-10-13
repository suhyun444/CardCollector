package com.suhyun444.cardcollector.Parser;

import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.*;

import com.suhyun444.cardcollector.DTO.PaymentStatus;
import com.suhyun444.cardcollector.Entity.Transaction;

public class KookminTransactionParser extends TransactionParser {
    @Override
    public List<Transaction> parse(Sheet sheet)
    {
        List<Transaction> transactions = new ArrayList<>();

        DataFormatter dataFormatter = new DataFormatter();
        for (int i = 4; i <= sheet.getLastRowNum() - 1; i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            if(Integer.parseInt(dataFormatter.formatCellValue(row.getCell(4)).replaceAll(",","")) == 0) continue;
            Transaction transaction = new Transaction();
            transaction.setId(null);
            transaction.setDate(dataFormatter.formatCellValue(row.getCell(0)));
            transaction.setMerchant(dataFormatter.formatCellValue(row.getCell(2)));

            String withdrawalStr = dataFormatter.formatCellValue(row.getCell(4)).replaceAll(",", "");
            transaction.setAmount(Integer.parseInt(withdrawalStr));
            transaction.setStatus(PaymentStatus.completed);
            transaction.setPaymentMethod(dataFormatter.formatCellValue(row.getCell(7)));
            
            String transactionKey = transaction.getDate()+"_"+transaction.getAmount()+"_"+transaction.getMerchant();
            transactionKey.replaceAll("\\s+","");
            transaction.setTransactionKey(transactionKey);

            transactions.add(transaction);
        }

        return transactions;
    }
}
