package com.example.backend.domain.cupon

import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface CuponRepository : JpaRepository<Cupon, Long> {
    fun findByCodigo(codigo: String): Optional<Cupon>
}
