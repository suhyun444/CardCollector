package com.suhyun444.cardcollector.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Keyword {
    @Id
    private String name;
    private String category;
}
