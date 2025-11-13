package com.example.backend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

// Datos que el usuario puede actualizar
data class UpdateProfileRequest(
    @field:NotBlank
    val name: String,

    @field:NotBlank
    val lastName: String,

    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha debe estar en formato YYYY-MM-DD")
    val birthDate: String
)