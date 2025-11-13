package com.example.backend.dto

import jakarta.validation.constraints.NotNull

data class AsignarRolRequest(
    @field:NotNull(message = "El ID del rol no puede ser nulo")
    val rolId: Long
)
