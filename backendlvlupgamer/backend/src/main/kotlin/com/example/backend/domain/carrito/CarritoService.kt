package com.example.backend.domain.carrito

import com.example.backend.domain.carrito.dto.*
import com.example.backend.domain.catalogo.ProductoRepository
import com.example.backend.domain.cupon.CuponRepository
import com.example.backend.domain.usuario.Usuario
import com.example.backend.domain.usuario.UsuarioRepository
import com.example.backend.exception.ResourceNotFoundException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
@Transactional
class CarritoService(
    private val carritoRepository: CarritoRepository,
    private val productoRepository: ProductoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val cuponRepository: CuponRepository // Inyectar
) {

    fun getCarritoResponse(): CarritoResponse {
        val carrito = getOrCreateCarritoForCurrentUser()
        return mapToCarritoResponse(carrito)
    }
    

    fun addItem(request: AddItemRequest): CarritoResponse {
        val carrito = getOrCreateCarritoForCurrentUser()
        val producto = productoRepository.findById(request.productoId)
            .orElseThrow { NoSuchElementException("Producto no encontrado") }

        val itemExistente = carrito.items.find { it.producto.id == request.productoId }

        if (itemExistente != null) {
            itemExistente.cantidad += request.cantidad
        } else {
            val nuevoItem = CarritoItem(
                carrito = carrito,
                producto = producto,
                cantidad = request.cantidad
            )
            carrito.items.add(nuevoItem)
        }

        val carritoGuardado = carritoRepository.save(carrito)
        return mapToCarritoResponse(carritoGuardado)
    }

    fun updateItemQuantity(productoId: Long, request: UpdateQuantityRequest): CarritoResponse {
        val carrito = getOrCreateCarritoForCurrentUser()
        val item = carrito.items.find { it.producto.id == productoId }
            ?: throw NoSuchElementException("Ítem no encontrado en el carrito")

        item.cantidad = request.cantidad

        val carritoGuardado = carritoRepository.save(carrito)
        return mapToCarritoResponse(carritoGuardado)
    }

    fun removeItem(productoId: Long): CarritoResponse {
        val carrito = getOrCreateCarritoForCurrentUser()
        carrito.items.removeIf { it.producto.id == productoId }

        val carritoGuardado = carritoRepository.save(carrito)
        return mapToCarritoResponse(carritoGuardado)
    }

    fun clearCarrito() {
        val carrito = getOrCreateCarritoForCurrentUser()
        carrito.items.clear()
        carritoRepository.save(carrito)
    }

    fun aplicarCupon(codigo: String): CarritoResponse {
        val carrito = getOrCreateCarritoForCurrentUser()
        val cupon = cuponRepository.findByCodigo(codigo)
            .orElseThrow { ResourceNotFoundException("El cupón '$codigo' no es válido o ha expirado.") }

        if (!cupon.activo) {
            throw ResourceNotFoundException("El cupón '$codigo' no es válido o ha expirado.")
        }

        if (cupon.fechaExpiracion != null && cupon.fechaExpiracion!!.isBefore(LocalDate.now())) {
            throw ResourceNotFoundException("El cupón '$codigo' no es válido o ha expirado.")
        }

        val montoMinimo = cupon.montoMinimoCompra
        if (montoMinimo != null && carrito.getSubtotal() < montoMinimo) {
            throw IllegalArgumentException("El cupón '$codigo' requiere una compra mínima de $montoMinimo.")
        }

        carrito.cupon = cupon
        val carritoGuardado = carritoRepository.save(carrito)
        return mapToCarritoResponse(carritoGuardado)
    }

    fun quitarCupon(): CarritoResponse {
        val carrito = getOrCreateCarritoForCurrentUser()
        carrito.cupon = null
        val carritoGuardado = carritoRepository.save(carrito)
        return mapToCarritoResponse(carritoGuardado)
    }

    private fun getOrCreateCarritoForCurrentUser(): Carrito {
        val usuario = getCurrentAuthenticatedUser()
        return carritoRepository.findByUsuarioId(usuario.id!!).orElseGet {
            val nuevoCarrito = Carrito(usuario = usuario)
            carritoRepository.save(nuevoCarrito)
        }
    }

    private fun getCurrentAuthenticatedUser(): Usuario {
        val email = SecurityContextHolder.getContext().authentication.name
        return usuarioRepository.findByEmail(email)
            .orElseThrow { IllegalStateException("Usuario no autenticado") }
    }

    private fun mapToCarritoResponse(carrito: Carrito): CarritoResponse {
        val itemResponses = carrito.items.map { item ->
            CarritoItemResponse(
                productoId = item.producto.id!!,
                nombreProducto = item.producto.nombre,
                imagenUrl = "/api/productos/${item.producto.id}/imagenes/1/base64",
                precioUnitario = item.producto.precio,
                cantidad = item.cantidad,
                subtotal = item.getSubtotal()
            )
        }
        return CarritoResponse(
            items = itemResponses,
            subtotal = carrito.getSubtotal(),
            descuento = carrito.getDescuento(),
            total = carrito.getTotal()
        )
    }
}
