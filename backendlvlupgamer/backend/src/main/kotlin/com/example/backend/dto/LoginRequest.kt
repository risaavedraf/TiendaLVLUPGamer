package com.example.backend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

// Esto es lo que la app Android enviará en el JSON para iniciar sesión
data class LoginRequest(
    @field:Email
    @field:NotBlank
    val email: String,

    @field:NotBlank
    val password: String
)