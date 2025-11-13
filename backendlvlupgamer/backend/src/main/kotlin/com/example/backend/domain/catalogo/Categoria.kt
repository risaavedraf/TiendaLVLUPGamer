package com.example.backend.domain.catalogo

import com.example.backend.domain.common.BaseAuditableEntity // Importar BaseAuditableEntity
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*

@Entity
@Table(name = "categorias")
data class Categoria(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    val nombre: String,

    @OneToMany(mappedBy = "categoria", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    @JsonManagedReference
    var productos: MutableList<Producto> = mutableListOf()
) : BaseAuditableEntity() // Extender BaseAuditableEntity
