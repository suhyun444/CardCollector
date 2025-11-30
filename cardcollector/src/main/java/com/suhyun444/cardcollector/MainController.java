/*
 * https://v0.app/chat/payment-history-website-rrH9UZjMPzs
 * https://www.perplexity.ai/search/web-gaebalhalddae-peuronteuneu-jWN91u2mTfqV7HqciyateA
 * https://chatgpt.com/c/68c64fb3-1430-8325-968d-0f26d2b48bcc
 */
package com.suhyun444.cardcollector;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.suhyun444.cardcollector.DTO.PaymentStatus;
import com.suhyun444.cardcollector.DTO.TransactionRequestDto;
import com.suhyun444.cardcollector.DTO.TransactionResponseDto;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class MainController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping({"/login/google"})
    public String start()
    {
        return "redirect:/oauth2/authorization/google";
    }
    
    @GetMapping("/")
    public String serveRoot() {
        System.out.println("Root access");
        return "forward:/index.html";
    }
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward(HttpServletRequest request) {
        String path = request.getRequestURI();
        
        return "forward:" + path + ".html";
    }
    // @GetMapping(value = {"/{path:^(?!api$|index\\.html$|assets/.*|static/.*|favicon\\.ico$).*}",
    //                      "/**/{path:^(?!api$|index\\.html$|assets/.*|static/.*|favicon\\.ico$).*}"})
    // public String redirect() {
    //     System.out.println("Main Screen");
    //     return "forward:/index.html";
        
    // }
    
    @GetMapping("api/user/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Object principal) {
        
        return ResponseEntity.ok(Map.of(
            "message", "Logged in successfully",
            "user", principal // 사용자 ID 또는 정보 반환
        ));
    }
    @PostMapping("api/transactions/upload")
    @ResponseBody
    public ResponseEntity<?> uploadTransactionsFromExcel(@RequestParam("file") MultipartFile file, 
                                                        @AuthenticationPrincipal String email) {
      try {

            List<TransactionRequestDto> transactions = transactionService.uploadAndParseExcel(file,email);
            return ResponseEntity.ok(Map.of("transactions", transactions));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Failed to parse Excel file"));
        }
    }
}