package com.suhyun444.cardcollector.Parser;

import java.util.ArrayList;
import java.util.List;
import org.apache.poi.ss.usermodel.*;

import com.suhyun444.cardcollector.DTO.TransactionRequestDto;

public class KookminTransactionParser extends TransactionParser {
    @Override
    public List<TransactionRequestDto> Parse(Sheet sheet)
    {
        List<TransactionRequestDto> transactions = new ArrayList<>();

        DataFormatter dataFormatter = new DataFormatter();
        for (int i = 4; i <= sheet.getLastRowNum() - 1; i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            if(Integer.parseInt(dataFormatter.formatCellValue(row.getCell(4)).replaceAll(",","")) == 0) continue;
            TransactionRequestDto dto = new TransactionRequestDto();

            dto.setDate(dataFormatter.formatCellValue(row.getCell(0)));
            dto.setMerchant(dataFormatter.formatCellValue(row.getCell(2)));

            String withdrawalStr = dataFormatter.formatCellValue(row.getCell(4)).replaceAll(",", "");
            dto.setAmount(Integer.parseInt(withdrawalStr));

            dto.setPaymentMethod(dataFormatter.formatCellValue(row.getCell(7)));
            transactions.add(dto);
        }

        for(int i=0;i<transactions.size();++i)
        {
            System.out.println(transactions.get(i).getDate() + " " + transactions.get(i).getMerchant() + " " + transactions.get(i).getAmount() + " " + transactions.get(i).getPaymentMethod());
        }

        return transactions;
    }
}
