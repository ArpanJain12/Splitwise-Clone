package practice.project.splitwise.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Splitwise API")
                        .version("1.0")
                        .description("API for managing shared expenses")
                        .contact(new Contact()
                                .name("Your Name")
                                .email("your.email@example.com")));
    }
}