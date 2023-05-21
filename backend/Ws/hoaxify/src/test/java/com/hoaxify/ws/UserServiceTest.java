package com.hoaxify.ws;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.hoaxify.ws.error.NotFoundException;
import com.hoaxify.ws.file.FileService;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;
import com.hoaxify.ws.user.UserService;
import com.hoaxify.ws.user.vm.UserUpdateVM;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private FileService fileService;

	@InjectMocks
	private UserService userService;

	@Test
	public void UserService_SaveUser_ShouldSaveUserWithEncodedPassword() {
		User user = TestUtil.createValidUser();
		String plainPassword = "password";
		String encodedPassword = "encodedPassword";

		when(passwordEncoder.encode(plainPassword)).thenReturn(encodedPassword);

		user.setPassword(plainPassword);
		userService.save(user);

		verify(passwordEncoder).encode(plainPassword);
		verify(userRepository).save(user);

		assertEquals(encodedPassword, user.getPassword());
	}

	@Test
	public void UserService_GetUsers_ShouldReturnFilteredUsers() {
		User user = TestUtil.createValidUser("admin");
		Pageable pageable = mock(Pageable.class);
		@SuppressWarnings("unchecked")
		Page<User> expectedPage = mock(Page.class);

		when(userRepository.findByUsernameNot(user.getUsername(), pageable)).thenReturn(expectedPage);
		when(userRepository.findAll(pageable)).thenReturn(expectedPage);

		Page<User> filterUser = userService.getUsers(pageable, user);
		Page<User> allUser = userService.getUsers(pageable, null);

		assertEquals(expectedPage, filterUser);
		assertEquals(expectedPage, allUser);
	}

	@Test
	public void UserService_GetByUsername_ShouldReturnUser() {
		String username = "test-user";
		User inDB = TestUtil.createValidUser();
		when(userRepository.findByUsername(username)).thenReturn(inDB);
		when(userRepository.findByUsername("notExist")).thenReturn(null);

		User findUser = userService.getByUsername(username);

		assertEquals(inDB, findUser);
		assertThrows(NotFoundException.class, () -> {
			userService.getByUsername("notExist");
		});
		verify(userRepository).findByUsername(username);
		verify(userRepository).findByUsername("notExist");
	}

	@Test
	public void UserService_UpdateUser_ShouldReturnUser() throws IOException {
		String username = "test-user";
		UserUpdateVM updatedUser = TestUtil.createUserUpdateVM();
		User inDB = TestUtil.createValidUser();

		when(userRepository.findByUsername(username)).thenReturn(inDB);
		when(fileService.writeBase64encodedStringToFile(anyString())).thenReturn("storedFileName");
		doNothing().when(fileService).deleteProfileImage(anyString());
		when(userRepository.save(any(User.class))).thenReturn(inDB);

		User result = userService.updateUser(username, updatedUser);

		assertThat(result).isNotNull();
	}

	@Test
	public void UserService_deleteUser_ReturnVoid() {
		String username = "test-user";
		User inDB = TestUtil.createValidUser();
		when(userRepository.findByUsername(anyString())).thenReturn(inDB);

		userService.deleteUser(inDB.getUsername());
		doNothing().when(fileService).deleteAllStoredFilesForUser(inDB);
		doNothing().when(userRepository).delete(inDB);

		assertAll(() -> userService.deleteUser(username));
	}
}
