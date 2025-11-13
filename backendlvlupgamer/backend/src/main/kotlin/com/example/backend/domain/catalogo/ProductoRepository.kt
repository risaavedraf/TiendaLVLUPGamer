package com.example.backend.domain.catalogo

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // Importar JpaSpecificationExecutor

interface ProductoRepository : JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {
    fun findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCase(nombre: String, descripcion: String): List<Producto>
}
