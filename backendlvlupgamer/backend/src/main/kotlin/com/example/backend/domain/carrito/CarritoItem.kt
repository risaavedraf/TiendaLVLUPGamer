package com.example.backend.domain.carrito

import com.example.backend.domain.catalogo.Producto
import jakarta.persistence.*

@Entity
class CarritoItem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "carrito_id")
    var carrito: Carrito,

    @ManyToOne
    @JoinColumn(name = "producto_id")
    val producto: Producto,

    var cantidad: Int
) {
    fun getSubtotal(): Double {
        return producto.precio * cantidad
    }
}
