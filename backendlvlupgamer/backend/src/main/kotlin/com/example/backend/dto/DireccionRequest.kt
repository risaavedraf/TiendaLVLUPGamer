package com.example.backend.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class DireccionRequest(
    @field:NotBlank(message = "El nombre de la dirección no puede estar vacío.")
    @field:Size(max = 50, message = "El nombre no puede tener más de 50 caracteres.")
    val nombre: String?,

    @field:NotBlank(message = "El nombre del destinatario no puede estar vacío.")
    val nombreDestinatario: String?,

    @field:NotBlank(message = "La calle no puede estar vacía.")
    val calle: String?,

    @field:NotBlank(message = "El número de casa no puede estar vacío.")
    val numeroCasa: String?,

    val numeroDepartamento: String?,

    @field:NotBlank(message = "La comuna no puede estar vacía.")
    val comuna: String?,

    @field:NotBlank(message = "La ciudad no puede estar vacía.")
    val ciudad: String?,

    @field:NotBlank(message = "La región no puede estar vacía.")
    val region: String?,

    @field:NotBlank(message = "El código postal no puede estar vacío.")
    val codigoPostal: String?
)