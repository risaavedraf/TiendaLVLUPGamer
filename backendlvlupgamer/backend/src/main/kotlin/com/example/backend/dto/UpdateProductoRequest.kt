package com.example.backend.dto

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class UpdateProductoRequest(
    val nombre: String?,
    val descripcion: String?,

    @field:Min(value = 0, message = "El precio debe ser mayor o igual a 0")
    val precio: Double?,

    @field:Min(value = 0, message = "El stock debe ser mayor o igual a 0")
    val stock: Int?,

    val categoriaId: Long?
)
