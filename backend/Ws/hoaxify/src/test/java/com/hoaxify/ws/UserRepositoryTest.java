package com.hoaxify.ws;

import static org.assertj.core.api.Assertions.assertThat;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

	@Autowired
	private UserRepository userRepository;

	@Test
	public void UserRepository_FindByUser_ReturnUser() {
		User user = TestUtil.createValidUser();
		userRepository.save(user);
		User inDB = userRepository.findByUsername(user.getUsername());
		Assertions.assertThat(inDB).isNotNull();
		Assertions.assertThat(user.getUsername()).isEqualTo(inDB.getUsername());
	}
	
	@Test
	public void UserRepository_whenUserDoesNotExist_returnNull() {
		User inDB = userRepository.findByUsername("nonexistinguser");
		assertThat(inDB).isNull();
	}

}
