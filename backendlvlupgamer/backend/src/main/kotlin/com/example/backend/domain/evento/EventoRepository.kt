package com.example.backend.domain.evento

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // Importar JpaSpecificationExecutor

interface EventoRepository : JpaRepository<Evento, Long>, JpaSpecificationExecutor<Evento> {
}
