package com.example.backend.dto

import jakarta.validation.constraints.NotBlank

data class CreateCategoriaRequest(
    @field:NotBlank(message = "El nombre de la categoría no puede estar vacío")
    val nombre: String
)
