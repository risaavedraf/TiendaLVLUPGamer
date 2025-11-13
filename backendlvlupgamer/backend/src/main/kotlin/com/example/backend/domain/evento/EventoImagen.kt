package com.example.backend.domain.evento

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.time.OffsetDateTime

@Entity
@Table(name = "evento_imagenes")
data class EventoImagen(
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
    var isPrincipal: Boolean = false,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    @JsonBackReference("evento-imagenes")
    var evento: Evento
) : BaseAuditableEntity() // Extender BaseAuditableEntity
