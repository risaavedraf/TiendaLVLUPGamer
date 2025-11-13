package com.example.backend.dto

import java.time.LocalDateTime

data class DireccionResponse(
    val id: Long,
    val nombre: String,
    val nombreDestinatario: String,
    val calle: String,
    val numeroCasa: String,
    val numeroDepartamento: String?,
    val comuna: String,
    val ciudad: String,
    val region: String,
    val codigoPostal: String,
    val createdAt: LocalDateTime?, // Cambiado a opcional
    val updatedAt: LocalDateTime? // Cambiado a opcional
)
