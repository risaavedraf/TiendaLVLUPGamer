package com.example.backend.domain.pedido

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import com.example.backend.domain.catalogo.Producto
import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*

@Entity
@Table(name = "detalle_pedidos")
data class DetallePedido(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val cantidad: Int,

    @Column(nullable = false)
    val precioUnitarioSnapshot: Double, // Precio del producto en el momento de la compra

    @Column(nullable = false)
    val nombreProductoSnapshot: String, // Nombre del producto en el momento de la compra

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonBackReference("pedido-detalles")
    val pedido: Pedido,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    val producto: Producto // Referencia al producto original
) : BaseAuditableEntity() // Extender BaseAuditableEntity
