package com.example.backend.dto

import java.time.LocalDateTime

data class CategoriaResponse(
    val id: Long,
    val nombre: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
