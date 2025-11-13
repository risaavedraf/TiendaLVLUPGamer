package com.example.backend.domain.review

import org.springframework.data.jpa.repository.JpaRepository

interface ReviewRepository : JpaRepository<Review, Long> {
    fun findByProductoId(productoId: Long): List<Review>
    fun existsByProductoIdAndUsuarioId(productoId: Long, usuarioId: Long): Boolean
    fun findByUsuarioId(usuarioId: Long): List<Review>
}