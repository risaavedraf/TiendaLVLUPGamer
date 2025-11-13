package com.example.backend.domain.review

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import com.example.backend.domain.catalogo.Producto
import com.example.backend.domain.usuario.Usuario
import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "reviews")
data class Review(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val calificacion: Int, // 1 a 5

    @Lob
    @Column(nullable = false)
    val comentario: String,

    @Column(nullable = false)
    val fecha: LocalDateTime = LocalDateTime.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonBackReference("usuario-reviews")
    val usuario: Usuario,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonBackReference("producto-reviews")
    val producto: Producto
) : BaseAuditableEntity() // Extender BaseAuditableEntity
