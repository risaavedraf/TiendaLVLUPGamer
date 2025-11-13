package com.example.backend.domain.pedido

import org.springframework.data.jpa.repository.JpaRepository

interface DetallePedidoRepository : JpaRepository<DetallePedido, Long> {
}