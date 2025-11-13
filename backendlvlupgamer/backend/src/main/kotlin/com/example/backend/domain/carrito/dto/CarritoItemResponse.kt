package com.example.backend.domain.carrito.dto

data class CarritoItemResponse(
    val productoId: Long,
    val nombreProducto: String,
    val imagenUrl: String,
    val precioUnitario: Double,
    val cantidad: Int,
    val subtotal: Double
)
