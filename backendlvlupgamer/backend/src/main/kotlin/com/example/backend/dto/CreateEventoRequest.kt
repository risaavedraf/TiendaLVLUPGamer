package com.example.backend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

data class CreateEventoRequest(
    @field:NotBlank(message = "El nombre del evento no puede estar vacío")
    val name: String,

    @field:NotBlank(message = "La descripción del evento no puede estar vacía")
    val description: String,

    @field:NotNull(message = "La fecha y hora del evento no pueden ser nulas")
    val date: LocalDateTime,

    @field:NotBlank(message = "El nombre de la ubicación no puede estar vacío")
    val locationName: String,

    @field:NotNull(message = "La latitud no puede ser nula")
    val latitude: Double,

    @field:NotNull(message = "La longitud no puede ser nula")
    val longitude: Double
)
