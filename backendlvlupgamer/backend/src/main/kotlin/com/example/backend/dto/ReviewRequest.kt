package com.example.backend.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class ReviewRequest(
    @field:Min(value = 1, message = "La calificación mínima es 1.")
    @field:Max(value = 5, message = "La calificación máxima es 5.")
    val calificacion: Int,

    @field:NotBlank(message = "El comentario no puede estar vacío.")
    val comentario: String
)