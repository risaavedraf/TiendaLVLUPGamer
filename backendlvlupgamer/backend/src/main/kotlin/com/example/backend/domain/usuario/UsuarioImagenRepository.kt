package com.example.backend.domain.usuario

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface UsuarioImagenRepository : JpaRepository<UsuarioImagen, Long> {
    fun findByUsuarioId(usuarioId: Long): List<UsuarioImagen>
    fun findByUsuarioIdAndProfileTrue(usuarioId: Long): UsuarioImagen?

    @Modifying
    @Query("UPDATE UsuarioImagen ui SET ui.profile = false WHERE ui.usuario.id = :usuarioId AND ui.profile = true")
    fun resetProfileImages(usuarioId: Long)
}