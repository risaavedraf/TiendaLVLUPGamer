package com.example.backend.dto

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class CheckoutItemRequest(
    @field:NotNull(message = "El ID del producto no puede ser nulo.")
    val productId: Long,

    @field:Min(value = 1, message = "La cantidad debe ser al menos 1.")
    val quantity: Int
)