package com.example.backend.domain.cupon

import jakarta.persistence.*

@Entity
@Table(name = "tipos_descuento")
class TipoDescuento(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val nombre: String // "PORCENTAJE" o "MONTO_FIJO"
)
