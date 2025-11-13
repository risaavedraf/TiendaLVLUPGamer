package com.example.backend.domain.rol

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import jakarta.persistence.*

@Entity
@Table(name = "roles")
data class Rol(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val nombre: String
) : BaseAuditableEntity() // Extender BaseAuditableEntity
