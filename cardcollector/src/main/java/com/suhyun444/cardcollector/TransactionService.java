package com.suhyun444.cardcollector;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.suhyun444.cardcollector.DTO.CategoryUpdateDTO;
import com.suhyun444.cardcollector.DTO.MerchantCategoryDto;
import com.suhyun444.cardcollector.DTO.TransactionDto;
import com.suhyun444.cardcollector.Entity.Transaction;
import com.suhyun444.cardcollector.Entity.User;
import com.suhyun444.cardcollector.Parser.KookminTransactionParser;
import com.suhyun444.cardcollector.Parser.TransactionParser;
import com.suhyun444.cardcollector.User.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionCategorizer transactionCategorizer;
    private static final Set<String> AMBIGUOUS_MERCHANTS = Set.of(
        "네이버페이", "카카오페이", "토스", "PAYCO", 
        "KG이니시스", "다날", "NICE페이", "KCP"
    );

    public TransactionService(TransactionRepository transactionRepository,
                              UserRepository userRepository,
                              TransactionCategorizer transactionCategorizer) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.transactionCategorizer = transactionCategorizer;
    }

    @Transactional
    public List<TransactionDto> uploadAndParseExcel(MultipartFile file, String email) throws Exception
    {
        TransactionParser parser = new KookminTransactionParser();
        List<Transaction> transactions;
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }

        try (InputStream is = file.getInputStream();
            Workbook workbook = WorkbookFactory.create(is)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            transactions = parser.parse(sheet);
            categorizeTransactions(transactions);
            
            User user = userRepository.findByEmail(email).orElseThrow();
            
            importTransactions(transactions,user);
            List<TransactionDto> result = transactionRepository.findAll().stream().map(TransactionDto::from).collect(Collectors.toList());
            return result;
        }
    }
    @Transactional
    public TransactionDto updateCategory(Long id,String newCategory)
    {
        Transaction transaction = transactionRepository.findById(id).orElseThrow();
        transaction.setCategory(newCategory);

        return TransactionDto.from(transaction);
    }
    private void importTransactions(List<Transaction> transactions,User user)
    {
        List<String> keys = transactions.stream()
            .map(Transaction::getTransactionKey)
            .collect(Collectors.toList());

        Set<String> existingKeys = transactionRepository.findExistingKeys(keys);

        List<Transaction> newTransactions = transactions.stream()
                                            .filter(transaction->!existingKeys.contains(transaction.getTransactionKey()))
                                            .collect(Collectors.toList());
        newTransactions.forEach(t->t.setUser(user));
        transactionRepository.saveAll(newTransactions);
        return ;
    }
    private void categorizeTransactions(List<Transaction> transactions) {
        List<String> uniqueMerchants = transactions.stream().map(Transaction::getMerchant).filter(m -> !AMBIGUOUS_MERCHANTS.contains(m)).distinct().collect(Collectors.toList());
        
        Map<String, String> historyMap = transactionRepository.findCategoriesByMerchantsOrderByDateDesc(uniqueMerchants).stream()
                                                                .collect(Collectors.toMap(
                                                                            MerchantCategoryDto::merchant,
                                                                            MerchantCategoryDto::category,
                                                                            (existing, replacement) -> existing ));

        transactions.forEach(t -> {
            Optional<String> historicalCategory = Optional.ofNullable(historyMap.get(t.getMerchant()));
            String finalCategory = transactionCategorizer.getCategory(t.getMerchant(), historicalCategory);
            t.setCategory(finalCategory);
        });
    }
}
