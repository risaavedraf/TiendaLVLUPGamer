package com.example.backend.domain.rol

import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface RolRepository : JpaRepository<Rol, Long> {
    fun findByNombre(nombre: String): Optional<Rol>
}