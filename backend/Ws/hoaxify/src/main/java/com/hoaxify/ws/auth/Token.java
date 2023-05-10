package com.hoaxify.ws.auth;

import com.hoaxify.ws.user.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "token")
public class Token {
	
	@Id
	private String token;
	
	@ManyToOne
	private User user;
}
