package com.vibrix.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableJpaRepositories({
        "com.vibrix.user.repository",
        "com.vibrix.catalog.repository"
})
@EnableTransactionManagement
@EnableJpaAuditing
public class DbConfig {
}
