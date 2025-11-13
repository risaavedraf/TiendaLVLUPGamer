package com.example.backend.dto

// Esto es lo que devolveremos al hacer login
data class LoginResponse(
    val token: String,
    val usuario: UsuarioResponse
)