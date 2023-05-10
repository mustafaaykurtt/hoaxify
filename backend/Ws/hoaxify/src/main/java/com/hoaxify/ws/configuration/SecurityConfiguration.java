package com.hoaxify.ws.configuration;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

 
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled=true)
public class SecurityConfiguration {
 
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	  
    http.csrf().disable();
    http.exceptionHandling().authenticationEntryPoint(new AuthEntryPoint()); 	//pop-up 'ı engelledik.;
	
    http.headers().frameOptions().disable();
    
    http.
    	authorizeHttpRequests()
			.requestMatchers(HttpMethod.PUT, "/api/1.0/users/{username}").authenticated() //authenticated olmak zorunda
			.requestMatchers(HttpMethod.POST, "/api/1.0/hoaxes").authenticated()
			.requestMatchers(HttpMethod.POST, "/api/1.0/hoax-attachments").authenticated()
			.requestMatchers(HttpMethod.POST, "/api/1.0/logout").authenticated()
			.and()															
		.authorizeHttpRequests()						// ardından bu requeslerden
			.anyRequest()								//herhangi birini
			.permitAll();								//umursama
 
    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);//session üretimini security için yapmıyor artık ve ben bir daha girdiğimde otomatik login yapmıyor 
    
    http.addFilterBefore(tokenFilter(), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
 
  @Bean
  public PasswordEncoder passwordEncoder() {	// bunu yapmamızın db deki hashli codu decode etmek.
    return new BCryptPasswordEncoder();
  }
  
  @Bean
  TokenFilter tokenFilter() {
	  return new TokenFilter();
  }
}
