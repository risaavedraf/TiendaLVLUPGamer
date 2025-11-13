package com.example.backend.domain.pedido

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EstadoPedidoRepository : JpaRepository<EstadoPedido, Long> {
    fun findByNombre(nombre: String): EstadoPedido?
}
