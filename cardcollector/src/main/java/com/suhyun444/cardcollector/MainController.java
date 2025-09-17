/*
 * https://v0.app/chat/payment-history-website-rrH9UZjMPzs
 * https://www.perplexity.ai/search/web-gaebalhalddae-peuronteuneu-jWN91u2mTfqV7HqciyateA
 * https://chatgpt.com/c/68c64fb3-1430-8325-968d-0f26d2b48bcc
 */
package com.suhyun444.cardcollector;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
    @GetMapping("/api/payments")
    @ResponseBody
    public List<PaymentDto> getPayments(
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        
        // 예시: DB 조회 로직 (JPA 기준)
		List<PaymentDto> paymentDtos = new ArrayList<>();
		paymentDtos.add(new PaymentDto(0L, "2025-09-01", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(1L, "2025-09-02", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(2L, "2025-09-03", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(3L, "2025-09-04", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(4L, "2025-09-05", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(5L, "2025-09-06", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(6L, "2025-09-07", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(7L, "2025-09-08", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(8L, "2025-09-09", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		paymentDtos.add(new PaymentDto(9L, "2025-09-10", "Amazon", 100, "Shopping", "buyitems", PaymentStatus.completed, "Credit Card ****1234"));
		System.out.println("ImportPayments");
        return paymentDtos;
        
	}
}