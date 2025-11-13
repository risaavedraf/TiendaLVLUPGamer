package com.example.backend.domain.carrito

import com.example.backend.domain.carrito.dto.AddItemRequest
import com.example.backend.domain.carrito.dto.CarritoResponse
import com.example.backend.domain.carrito.dto.CuponRequest
import com.example.backend.domain.carrito.dto.UpdateQuantityRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/carrito")
class CarritoController(private val carritoService: CarritoService) {

    @GetMapping
    fun getCarrito(): ResponseEntity<CarritoResponse> {
        val carrito = carritoService.getCarritoResponse()
        return ResponseEntity.ok(carrito)
    }

    @PostMapping("/items")
    fun addItemToCarrito(@RequestBody request: AddItemRequest): ResponseEntity<CarritoResponse> {
        val carritoActualizado = carritoService.addItem(request)
        return ResponseEntity.ok(carritoActualizado)
    }

    @PutMapping("/items/{productoId}")
    fun updateItemQuantity(
        @PathVariable productoId: Long,
        @RequestBody request: UpdateQuantityRequest
    ): ResponseEntity<CarritoResponse> {
        val carritoActualizado = carritoService.updateItemQuantity(productoId, request)
        return ResponseEntity.ok(carritoActualizado)
    }

    @DeleteMapping("/items/{productoId}")
    fun removeItemFromCarrito(@PathVariable productoId: Long): ResponseEntity<CarritoResponse> {
        val carritoActualizado = carritoService.removeItem(productoId)
        return ResponseEntity.ok(carritoActualizado)
    }

    @DeleteMapping
    fun clearCarrito(): ResponseEntity<Void> {
        carritoService.clearCarrito()
        return ResponseEntity.noContent().build()
    }

    // --- Nuevos Endpoints para Cupones ---

    @PostMapping("/cupon")
    fun aplicarCupon(@RequestBody cuponRequest: CuponRequest): ResponseEntity<CarritoResponse> {
        val carritoActualizado = carritoService.aplicarCupon(cuponRequest.codigo)
        return ResponseEntity.ok(carritoActualizado)
    }

    @DeleteMapping("/cupon")
    fun quitarCupon(): ResponseEntity<CarritoResponse> {
        val carritoActualizado = carritoService.quitarCupon()
        return ResponseEntity.ok(carritoActualizado)
    }
}
