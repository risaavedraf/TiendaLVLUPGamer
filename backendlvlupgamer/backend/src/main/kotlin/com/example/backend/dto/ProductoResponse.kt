package com.example.backend.dto

import java.time.LocalDateTime // Importar LocalDateTime

data class ProductoResponse(
    val id: Long,
    val nombre: String,
    val descripcion: String,
    val precio: Double,
    val stock: Int,
    val categoria: CategoriaResponse,
    val imagenUrl: String?, // Campo para la URL de la imagen principal
    val createdAt: LocalDateTime, // Añadido
    val updatedAt: LocalDateTime // Añadido
)
