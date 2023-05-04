package com.hoaxify.ws.error;

import java.util.Date;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)   // eğer bunu error mesajı olarak yololadığımızda içinde null değer varsa onu yollama.
public class ApiError {
	
	public ApiError(int status, String message, String path) {
		this.status = status;
		this.message = message;
		this.path = path;
	}
	
	private int status;
	
	private String message;
	
	//hatanın path'i
	private String path;
	
	//hatanın zamanı için.
	private long timestamp = new Date().getTime();
	
	//hata ile ilgili bir bilgi paylaşmalıyız bunu mapte tuttuk.
	private Map<String, String> validationErrors;
	
}
