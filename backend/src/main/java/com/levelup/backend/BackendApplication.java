package com.levelup.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.core.env.Environment;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		var context = SpringApplication.run(BackendApplication.class, args);
		System.out.println("...........................................................................");
		System.out.println("..............................APPLICATION RUNNING........................");
		System.out.println("..............................................................................");
		Environment env = context.getEnvironment();
        String port = env.getProperty("server.port");
        System.out.println(".................Auth Service is running on port: " + port);
	}

}
