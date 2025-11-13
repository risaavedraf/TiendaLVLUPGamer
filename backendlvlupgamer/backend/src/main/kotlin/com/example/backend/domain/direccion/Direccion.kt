package com.example.backend.domain.direccion

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import com.example.backend.domain.usuario.Usuario
import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*

@Entity
@Table(name = "direcciones")
data class Direccion(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    var nombre: String, // "Casa", "Oficina", etc.

    var nombreDestinatario: String,

    var calle: String,

    var numeroCasa: String,

    var numeroDepartamento: String? = null,

    var comuna: String,

    var ciudad: String,

    var region: String,

    var codigoPostal: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonBackReference
    var usuario: Usuario
) : BaseAuditableEntity() // Extender BaseAuditableEntity
