package com.example.backend.dto

import java.time.LocalDateTime

data class EventoResponse(
    val id: Long,
    val name: String,
    val description: String,
    val date: LocalDateTime,
    val locationName: String,
    val latitude: Double,
    val longitude: Double,
    val imageUrl: String?, // URL generada dinámicamente
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
