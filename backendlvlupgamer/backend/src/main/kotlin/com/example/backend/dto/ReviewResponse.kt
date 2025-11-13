package com.example.backend.dto

import java.time.LocalDateTime

data class ReviewResponse(
    val id: Long,
    val calificacion: Int,
    val comentario: String,
    val fecha: LocalDateTime,
    val author: String, // username del usuario
    val authorId: Long,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
