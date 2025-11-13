package com.example.backend.domain.pedido

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import com.example.backend.domain.usuario.Usuario
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "pedidos")
data class Pedido(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val fechaPedido: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    val total: Double, // Total final del pedido

    @ManyToOne(fetch = FetchType.EAGER) // EAGER para que el estado siempre esté disponible
    @JoinColumn(name = "estado_id", nullable = false)
    var estado: EstadoPedido,

    // Snapshot de la dirección de envío
    @Column(nullable = false)
    val direccionNombre: String,
    @Column(nullable = false)
    val direccionNombreDestinatario: String,
    @Column(nullable = false)
    val direccionCalle: String,
    @Column(nullable = false)
    val direccionNumeroCasa: String,
    val direccionNumeroDepartamento: String?,
    @Column(nullable = false)
    val direccionComuna: String,
    @Column(nullable = false)
    val direccionCiudad: String,
    @Column(nullable = false)
    val direccionRegion: String,
    @Column(nullable = false)
    val direccionCodigoPostal: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    val usuario: Usuario,

    @OneToMany(mappedBy = "pedido", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("pedido-detalles")
    var detalles: MutableList<DetallePedido> = mutableListOf()
) : BaseAuditableEntity() // Extender BaseAuditableEntity
