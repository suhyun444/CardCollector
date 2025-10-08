package com.suhyun444.cardcollector;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransactionCategorizer {

    private Map<String,String> keywordMap = new HashMap<>();
    public TransactionCategorizer(KeywordProvider keywordProvider)
    {
        keywordMap = keywordProvider.getKeywordMap();
    }
    public String getCategory(String merchant,Optional<String> databaseResult)
    {
        String result = null;
        if(!databaseResult.isPresent()) result = getFromKeyword(merchant);
        if(result == null) return "기타";
        return result;
    }
    private String getFromKeyword(String merchant)
    {
        Optional<String> categoryFromKeyword = keywordMap.keySet().stream()
                .filter(merchant::contains)
                .findFirst(); 
        
        if (categoryFromKeyword.isPresent()) {
            return keywordMap.get(categoryFromKeyword.get());
        }
        return null;
    }
}
