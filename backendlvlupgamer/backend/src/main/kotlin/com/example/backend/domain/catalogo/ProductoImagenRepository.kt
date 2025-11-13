package com.example.backend.domain.catalogo

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.Optional

interface ProductoImagenRepository : JpaRepository<ProductoImagen, Long> {
    fun findByProductoIdAndIsPrincipalTrue(productoId: Long): Optional<ProductoImagen>

    @Modifying
    @Query("UPDATE ProductoImagen pi SET pi.isPrincipal = false WHERE pi.producto.id = :productoId AND pi.isPrincipal = true")
    fun resetPrincipalImage(productoId: Long)
}