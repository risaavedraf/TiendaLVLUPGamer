package com.example.backend.domain.catalogo

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // Importar JpaSpecificationExecutor
import java.util.Optional

interface CategoriaRepository : JpaRepository<Categoria, Long>, JpaSpecificationExecutor<Categoria> {
    fun findByNombre(nombre: String): Optional<Categoria>
}
