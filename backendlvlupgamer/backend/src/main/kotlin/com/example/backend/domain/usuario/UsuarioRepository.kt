package com.example.backend.domain.usuario

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // Importar JpaSpecificationExecutor
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface UsuarioRepository : JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario> {

    // Spring Data JPA creará la consulta automáticamente solo con nombrar el método
    
    // Usado para el Login
    fun findByEmail(email: String): Optional<Usuario>

    // Usado para verificar si el email ya existe en el registro
    fun existsByEmail(email: String): Boolean

    // Usado para verificar si el username ya existe en el registro
    fun existsByUsername(username: String): Boolean
}
