package com.hoaxify.ws.share;

import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Target({ ElementType.PARAMETER })
@Retention(RUNTIME)
@AuthenticationPrincipal           //Bize doğrudan .getAuthentication().getPrincipal(); işlemini yapıp user'a atayacak o anda hangi user varsa

public @interface CurrentUser {

}
