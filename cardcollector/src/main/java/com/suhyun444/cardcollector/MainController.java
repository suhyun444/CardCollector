/*
 * https://v0.app/chat/payment-history-website-rrH9UZjMPzs
 * https://www.perplexity.ai/search/web-gaebalhalddae-peuronteuneu-jWN91u2mTfqV7HqciyateA
 * https://chatgpt.com/c/68c64fb3-1430-8325-968d-0f26d2b48bcc
 */
package com.suhyun444.cardcollector;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.suhyun444.cardcollector.DTO.PaymentStatus;
import com.suhyun444.cardcollector.DTO.TransactionRequestDto;
import com.suhyun444.cardcollector.DTO.TransactionResponseDto;
import com.suhyun444.cardcollector.Parser.KookminTransactionParser;
import com.suhyun444.cardcollector.Parser.TransactionParser;

@Controller
public class MainController {

    @GetMapping("/")
    public String serveRoot() {
        System.out.println("Root access");
        return "forward:/index.html";
    }

    @GetMapping(value = {"/{path:^(?!api$|index\\.html$|assets/.*|static/.*|favicon\\.ico$).*}",
                         "/**/{path:^(?!api$|index\\.html$|assets/.*|static/.*|favicon\\.ico$).*}"})
    public String redirect() {
        System.out.println("Main Screen");
        return "forward:/index.html";
        
    }
    @GetMapping("/api/transactions/get")
    @ResponseBody
    public List<TransactionResponseDto> getTransactions(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        
        // 예시: DB 조회 로직 (JPA 기준)
		List<TransactionResponseDto> paymentDtos = new ArrayList<>();
		paymentDtos.add(new TransactionResponseDto("0", "2025-09-01", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("1", "2025-09-02", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("2", "2025-09-03", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("3", "2025-09-04", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("4", "2025-09-05", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("5", "2025-09-06", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("6", "2025-09-07", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("7", "2025-09-08", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("8", "2025-09-09", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new TransactionResponseDto("9", "2025-09-10", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		System.out.println("ImportPayments");
        return paymentDtos;   
	}
     
    @PostMapping("api/transactions/upload")
    @ResponseBody
    public ResponseEntity<?> uploadTransactionsFromExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }
        TransactionParser parser = new KookminTransactionParser();
        List<TransactionRequestDto> transactions;

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            transactions = parser.Parse(sheet);
            return ResponseEntity.ok(Map.of("transactions", transactions));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Failed to parse Excel file"));
        }
    }
}