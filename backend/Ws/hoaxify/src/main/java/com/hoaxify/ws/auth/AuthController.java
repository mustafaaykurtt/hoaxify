package com.hoaxify.ws.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.share.CurrentUser;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;
import com.hoaxify.ws.user.vm.UserVM;

@RestController
public class AuthController {

	@Autowired
	UserRepository userRepository;

	@PostMapping("/api/1.0/auth")
	public UserVM handleAuthentication(@CurrentUser User user) {
		return new UserVM(user);
	}
}
