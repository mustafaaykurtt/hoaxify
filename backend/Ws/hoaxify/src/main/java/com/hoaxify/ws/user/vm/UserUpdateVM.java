package com.hoaxify.ws.user.vm;

import com.hoaxify.ws.share.FileType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVM {
	
	@NotNull
	@Size(min = 4 , max = 255)
	private String displayName;
	
	@FileType(types={"jpeg","png"})
	private String image;
}
