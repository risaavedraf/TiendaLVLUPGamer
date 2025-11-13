package com.example.backend.dto

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class CreateProductoRequest(
    @field:NotBlank(message = "El nombre del producto no puede estar vacío")
    val nombre: String,

    @field:NotBlank(message = "La descripción del producto no puede estar vacía")
    val descripcion: String,

    @field:NotNull(message = "El precio del producto no puede ser nulo")
    @field:Min(value = 0, message = "El precio debe ser mayor o igual a 0")
    val precio: Double,

    @field:NotNull(message = "El stock del producto no puede ser nulo")
    @field:Min(value = 0, message = "El stock debe ser mayor o igual a 0")
    val stock: Int,

    @field:NotNull(message = "La categoría del producto no puede ser nula")
    val categoriaId: Long
)
