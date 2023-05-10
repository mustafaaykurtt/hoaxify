package com.hoaxify.ws.hoax;

import java.util.Date;

import com.hoaxify.ws.file.FileAttachment;
import com.hoaxify.ws.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "hoax")
public class Hoax {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(length = 1000)
	private String content;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date timeStamp;
	
	@ManyToOne
	private User user;
	
	@OneToOne(mappedBy = "hoax", cascade = CascadeType.REMOVE)
	private FileAttachment fileAttachment;
	
}
