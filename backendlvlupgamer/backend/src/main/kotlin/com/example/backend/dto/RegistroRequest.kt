package com.example.backend.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Pattern

data class RegistroRequest(
    @field:NotBlank(message = "Username no puede estar vacío")
    val username: String,

    @field:Email(message = "Email debe ser válido")
    @field:NotBlank(message = "Email no puede estar vacío")
    val email: String,

    @field:NotBlank(message = "Contraseña no puede estar vacía")
    @field:Size(min = 6, message = "Contraseña debe tener al menos 6 caracteres")
    val password: String,

    // --- CAMPOS CORREGIDOS ---
    @field:NotBlank(message = "Nombre no puede estar vacío")
    val name: String,

    @field:NotBlank(message = "Apellido no puede estar vacío")
    val lastName: String,

    // Aceptamos la fecha como un String en formato YYYY-MM-DD
    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha debe estar en formato YYYY-MM-DD")
    val birthDate: String
)