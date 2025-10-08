package com.suhyun444.cardcollector;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.suhyun444.cardcollector.Entity.Keyword;

@Repository
public interface KeywordRepository extends JpaRepository<Keyword,String> {
    
}
