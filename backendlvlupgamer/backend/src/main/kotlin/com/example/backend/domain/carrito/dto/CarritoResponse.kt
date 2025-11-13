package com.example.backend.domain.carrito.dto

data class CarritoResponse(
    val items: List<CarritoItemResponse>,
    val subtotal: Double,
    val descuento: Double,
    val total: Double
)
