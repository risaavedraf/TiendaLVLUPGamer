package com.example.backend.domain.direccion

import org.springframework.data.jpa.repository.JpaRepository

interface DireccionRepository : JpaRepository<Direccion, Long> {
    fun findByUsuarioEmail(email: String): List<Direccion>
}