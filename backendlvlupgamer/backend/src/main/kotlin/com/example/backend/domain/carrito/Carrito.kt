package com.example.backend.domain.carrito

import com.example.backend.domain.cupon.Cupon
import com.example.backend.domain.usuario.Usuario
import jakarta.persistence.*

@Entity
class Carrito(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    val usuario: Usuario,

    @OneToMany(mappedBy = "carrito", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val items: MutableList<CarritoItem> = mutableListOf(),

    @ManyToOne
    @JoinColumn(name = "cupon_id")
    var cupon: Cupon? = null
) {
    fun getSubtotal(): Double {
        return items.sumOf { it.getSubtotal() }
    }

    fun getDescuento(): Double {
        val subtotal = getSubtotal()
        val cuponAplicado = cupon

        if (cuponAplicado == null || !cuponAplicado.activo) {
            return 0.0
        }

        // Validar monto mínimo de compra
        val montoMinimo = cuponAplicado.montoMinimoCompra
        if (montoMinimo != null && subtotal < montoMinimo) {
            return 0.0 // No aplica el descuento si no se alcanza el mínimo
        }

        return when (cuponAplicado.tipo.nombre) {
            "PORCENTAJE" -> subtotal * cuponAplicado.valor
            "MONTO_FIJO" -> cuponAplicado.valor
            else -> 0.0
        }
    }

    fun getTotal(): Double {
        val subtotal = getSubtotal()
        val descuento = getDescuento()
        val total = subtotal - descuento
        return if (total < 0) 0.0 else total // El total no puede ser negativo
    }
}
