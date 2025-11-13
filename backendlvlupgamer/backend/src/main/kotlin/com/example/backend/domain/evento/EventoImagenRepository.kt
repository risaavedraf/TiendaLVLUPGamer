package com.example.backend.domain.evento

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.Optional

interface EventoImagenRepository : JpaRepository<EventoImagen, Long> {
    fun findByEventoIdAndIsPrincipalTrue(eventoId: Long): Optional<EventoImagen>

    @Modifying
    @Query("UPDATE EventoImagen ei SET ei.isPrincipal = false WHERE ei.evento.id = :eventoId AND ei.isPrincipal = true")
    fun resetPrincipalImage(eventoId: Long)
}