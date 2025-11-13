package com.example.backend.dto

import java.time.LocalDateTime

data class DetallePedidoResponse(
    val productId: Long,
    val productName: String,
    val quantity: Int,
    val unitPrice: Double,
    val subtotal: Double,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
