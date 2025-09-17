package com.suhyun444.cardcollector;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@SpringBootApplication
public class CardcollectorApplication {

	public static void main(String[] args) {
		SpringApplication.run(CardcollectorApplication.class, args);
	}

}
