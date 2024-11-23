package org.andy.springend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all endpoints
                .allowedOrigins("http://localhost:3000") // Allowed origins
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allowed HTTP methods
                .allowedHeaders("*") // Allowed headers
                .allowCredentials(true) // Allow credentials
                .maxAge(3600); // Cache duration for preflight requests
    }
}
