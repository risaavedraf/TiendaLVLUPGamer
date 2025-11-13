package com.example.backend.domain.usuario

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import jakarta.persistence.*
import java.time.OffsetDateTime
import com.fasterxml.jackson.annotation.JsonBackReference

@Entity
@Table(name = "usuario_imagenes")
data class UsuarioImagen(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var filename: String,

    @Column(nullable = false)
    var contentType: String,

    @Lob
    @Column(nullable = false)
    var data: ByteArray,

    @Column(nullable = false)
    var size: Long,

    @Column(nullable = false)
    var uploadedAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(nullable = false)
    var profile: Boolean = false,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @JsonBackReference
    var usuario: Usuario? = null
) : BaseAuditableEntity() // Extender BaseAuditableEntity
