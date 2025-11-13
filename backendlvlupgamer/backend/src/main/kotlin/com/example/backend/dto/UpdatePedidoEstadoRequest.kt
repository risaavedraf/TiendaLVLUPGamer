package com.example.backend.dto

import jakarta.validation.constraints.NotBlank

data class UpdatePedidoEstadoRequest(
    @field:NotBlank(message = "El nombre del estado no puede estar vacío")
    val nuevoEstadoNombre: String
)
