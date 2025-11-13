package com.example.backend.domain.evento

import com.example.backend.domain.common.BaseAuditableEntity
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "eventos")
data class Evento(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String,

    // Eliminada la anotación @Lob
    @Column(nullable = false)
    var description: String,

    @Column(nullable = false)
    var date: LocalDateTime,

    @Column(nullable = false)
    var locationName: String,

    @Column(nullable = false)
    var latitude: Double,

    @Column(nullable = false)
    var longitude: Double,

    @OneToMany(mappedBy = "evento", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("evento-imagenes")
    var imagenes: MutableList<EventoImagen> = mutableListOf()
) : BaseAuditableEntity()
