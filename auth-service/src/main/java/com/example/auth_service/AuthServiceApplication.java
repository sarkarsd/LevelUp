package com.example.auth_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		var context = SpringApplication.run(AuthServiceApplication.class, args);
		System.out.println("...........................................................................");
		System.out.println("..............................AUTH SERVICE RUNNING........................");
		System.out.println("..............................................................................");
		Environment env = context.getEnvironment();
        String port = env.getProperty("server.port");
        System.out.println("Auth Service is running on port: " + port);
	}

}
