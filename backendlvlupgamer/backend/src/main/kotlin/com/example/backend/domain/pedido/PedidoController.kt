package com.example.backend.domain.pedido

import com.example.backend.dto.CheckoutRequest
import com.example.backend.dto.PedidoResponse
import com.example.backend.dto.UpdatePedidoEstadoRequest // Importar el nuevo DTO
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize // Importar PreAuthorize
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/api/pedidos")
class PedidoController(private val pedidoService: PedidoService) {

    @PostMapping("/checkout")
    fun checkout(
        @Valid @RequestBody request: CheckoutRequest,
        principal: Principal
    ): ResponseEntity<PedidoResponse> {
        val nuevoPedido = pedidoService.checkout(request, principal.name)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido)
    }

    @GetMapping("/me")
    fun getMyPedidos(principal: Principal): ResponseEntity<List<PedidoResponse>> {
        val pedidos = pedidoService.getPedidosByUsuario(principal.name)
        return ResponseEntity.ok(pedidos)
    }

    // ELIMINADO: Este endpoint se ha movido a AdminPedidoController.kt
    /*
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')") // Solo administradores pueden cambiar el estado
    fun actualizarEstadoPedido(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdatePedidoEstadoRequest
    ): ResponseEntity<PedidoResponse> {
        val pedidoActualizado = pedidoService.actualizarEstadoPedido(id, request.nuevoEstadoNombre)
        return ResponseEntity.ok(pedidoActualizado)
    }
    */
}
