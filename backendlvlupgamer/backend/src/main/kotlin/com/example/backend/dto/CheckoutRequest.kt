package com.example.backend.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size // Importar Size

data class CheckoutRequest(
    @field:NotNull(message = "El ID de la dirección no puede ser nulo.")
    val direccionId: Long,

    @field:Valid // Valida cada item en la lista
    @field:NotNull(message = "La lista de productos no puede ser nula.")
    @field:Size(min = 1, message = "Debe haber al menos un producto en el carrito.") // <-- CAMBIO AQUÍ
    val items: List<CheckoutItemRequest>
)