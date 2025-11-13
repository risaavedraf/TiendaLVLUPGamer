package com.example.backend.domain.cupon

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "cupones")
class Cupon(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val codigo: String,

    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_descuento_id", referencedColumnName = "id")
    val tipo: TipoDescuento,

    @Column(nullable = false)
    val valor: Double, // 0.10 para 10% o 5000.0 para monto fijo

    val fechaExpiracion: LocalDate? = null,

    @Column(nullable = false)
    val activo: Boolean = true,

    val montoMinimoCompra: Double? = null
)
