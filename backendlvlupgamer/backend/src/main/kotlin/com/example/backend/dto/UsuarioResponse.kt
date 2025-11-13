package com.example.backend.dto

import java.time.LocalDate
import java.time.LocalDateTime

data class UsuarioResponse(
    val id: Long,
    val username: String,
    val email: String,
    val roles: Set<String>,
    val name: String,
    val lastName: String,
    val birthDate: LocalDate?,
    val profileImageBase64: String? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
