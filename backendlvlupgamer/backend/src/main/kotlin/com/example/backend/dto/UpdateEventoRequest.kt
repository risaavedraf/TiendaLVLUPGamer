package com.example.backend.dto

import java.time.LocalDateTime

data class UpdateEventoRequest(
    val name: String?,
    val description: String?,
    val date: LocalDateTime?,
    val locationName: String?,
    val latitude: Double?,
    val longitude: Double?
)
