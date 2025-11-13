package com.example.backend.domain.carrito.dto

data class AddItemRequest(
    val productoId: Long,
    val cantidad: Int
)
