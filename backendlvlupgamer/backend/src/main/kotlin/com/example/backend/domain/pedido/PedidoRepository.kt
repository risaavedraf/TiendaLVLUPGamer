package com.example.backend.domain.pedido

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor // Importar JpaSpecificationExecutor

interface PedidoRepository : JpaRepository<Pedido, Long>, JpaSpecificationExecutor<Pedido> {
    fun findByUsuarioEmailOrderByFechaPedidoDesc(email: String): List<Pedido>
}
