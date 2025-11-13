package com.example.backend.config

import com.example.backend.security.JwtAuthenticationFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthenticationFilter
) {

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration): AuthenticationManager {
        return authenticationConfiguration.authenticationManager
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { } // Habilitar CORS
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers(
                        "/api/auth/**",
                        "/h2-console/**"
                    ).permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/productos/**", "/api/categorias/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/eventos/**", "/api/eventos/{eventoId}/imagenes/**").permitAll()
                    
                    .requestMatchers("/api/admin/**").hasRole("ADMIN") // <-- AÑADIDO: Proteger endpoints de admin
                    
                    .requestMatchers("/api/perfil/**").authenticated()
                    .requestMatchers("/api/usuarios/**").authenticated()
                    .requestMatchers("/api/direcciones/**").authenticated()
                    // .requestMatchers("/api/roles/**").hasRole("ADMIN") // Comentado porque usamos @PreAuthorize

                    .anyRequest().authenticated()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .headers { headers -> headers.frameOptions { it.sameOrigin() } }
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}