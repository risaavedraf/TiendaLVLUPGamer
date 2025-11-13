package com.example.backend.dto

import java.time.LocalDateTime
import java.time.OffsetDateTime

data class EventoImagenResponse(
    val id: Long,
    val filename: String,
    val contentType: String,
    val size: Long,
    val uploadedAt: OffsetDateTime,
    val isPrincipal: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
