package com.hoaxify.ws;

import org.springframework.test.context.ActiveProfiles;

import com.hoaxify.ws.hoax.Hoax;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.vm.UserUpdateVM;

@ActiveProfiles("test")
public class TestUtil {
	
	public static User createValidUser() {
		User user = new User();
		user.setUsername("test-user");
		user.setDisplayName("test-display");
		user.setPassword("P4ssword");
		user.setImage("profile-image.png");
		return user;
	}
	
	public static User createValidUser(String username) {
		User user = createValidUser();
		user.setUsername(username);
		return user;
	}
	
	public static Hoax createValidHoax() {
		Hoax hoax = new Hoax();
		hoax.setContent("test content for the test hoax");
		return hoax;
	}
	
	public static UserUpdateVM createUserUpdateVM() {
		UserUpdateVM userUpdateVm = new UserUpdateVM();
		userUpdateVm.setDisplayName("new-display");
		userUpdateVm.setImage("image");
		return userUpdateVm;
	}
	
}
