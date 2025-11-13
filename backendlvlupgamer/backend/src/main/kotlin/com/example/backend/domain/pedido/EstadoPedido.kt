package com.example.backend.domain.pedido

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import jakarta.persistence.*

@Entity
@Table(name = "estados_pedido")
data class EstadoPedido(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val nombre: String, // Ej: "PENDIENTE", "PROCESANDO", "ENVIADO", "ENTREGADO", "CANCELADO"

    @Column(nullable = true)
    val descripcion: String? = null
) : BaseAuditableEntity() // Extender BaseAuditableEntity
