package com.example.backend.domain.carrito

import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface CarritoRepository : JpaRepository<Carrito, Long> {
    fun findByUsuarioId(usuarioId: Long): Optional<Carrito>
}
