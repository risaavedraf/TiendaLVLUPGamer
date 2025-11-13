package com.example.backend.domain.catalogo

import com.example.backend.domain.common.BaseAuditableEntity
import com.example.backend.domain.pedido.DetallePedido
import com.example.backend.domain.review.Review
import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*

@Entity
@Table(name = "productos")
data class Producto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var nombre: String,

    @Column(nullable = false)
    var descripcion: String,

    @Column(nullable = false)
    var precio: Double,

    @Column(nullable = false)
    var stock: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    @JsonBackReference
    var categoria: Categoria,

    @OneToMany(mappedBy = "producto", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("producto-imagenes")
    var imagenes: MutableList<ProductoImagen> = mutableListOf(),

    @OneToMany(mappedBy = "producto", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("producto-reviews")
    var reviews: MutableList<Review> = mutableListOf(),

    @OneToMany(mappedBy = "producto", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("producto-detalles-pedido")
    var detallesPedido: MutableList<DetallePedido> = mutableListOf()
) : BaseAuditableEntity()
