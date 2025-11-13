package com.example.backend.dto

import java.time.LocalDateTime

data class ErrorResponse(
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val status: Int,
    val error: String,
    val message: String?,
    val path: String,
    val errors: Map<String, String>? = null // Añadido para errores de validación
)
