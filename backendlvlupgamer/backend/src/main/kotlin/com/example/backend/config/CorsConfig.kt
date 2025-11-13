package com.example.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig {

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        
        // Permitir peticiones desde el frontend
        config.allowCredentials = true
        config.addAllowedOriginPattern("http://localhost:*") // Permite cualquier puerto en localhost
        config.addAllowedOrigin("http://localhost:5173") // Puerto de Vite
        config.addAllowedOrigin("http://localhost:3000") // Puerto alternativo
        
        // Permitir todos los headers
        config.addAllowedHeader("*")
        
        // Permitir todos los métodos HTTP
        config.addAllowedMethod("*")
        
        // Exponer headers de autenticación
        config.addExposedHeader("Authorization")
        
        source.registerCorsConfiguration("/api/**", config)
        
        return CorsFilter(source)
    }
}
