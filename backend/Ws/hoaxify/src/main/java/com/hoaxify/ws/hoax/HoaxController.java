package com.hoaxify.ws.hoax;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hoaxify.ws.share.GenericResponse;

import jakarta.validation.Valid;

@RestController
public class HoaxController {

	@Autowired
	HoaxService hoaxService;
	
	@PostMapping("/api/1.0/hoaxes")
	public GenericResponse saveHoax(@Valid @RequestBody Hoax hoax) {
		hoaxService.save(hoax);
		return new GenericResponse("Hoax is saved");
	}
}
