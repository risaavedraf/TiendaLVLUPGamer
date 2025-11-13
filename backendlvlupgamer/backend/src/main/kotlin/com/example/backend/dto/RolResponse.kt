package com.example.backend.dto

import java.time.LocalDateTime

data class RolResponse(
    val id: Long,
    val nombre: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
