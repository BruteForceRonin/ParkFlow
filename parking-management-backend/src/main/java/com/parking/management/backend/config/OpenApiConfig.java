package com.parking.management.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ParkFlow")
                        .version("1.2")
                        .description("A parking ticketing system")
                        .contact(new Contact()
                                .name("Someone")
                                .email("Someone@something.com"))
                );
    }
}

