package com.example.backend.domain.pedido

import com.example.backend.dto.PageResponse
import com.example.backend.dto.PedidoResponse
import com.example.backend.dto.UpdatePedidoEstadoRequest
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/pedidos")
@PreAuthorize("hasRole('ADMIN')") // Asegura que todos los métodos en este controlador requieren el rol ADMIN
class AdminPedidoController(private val pedidoService: PedidoService) {

    @GetMapping
    fun getAllPedidos(
        @RequestParam(required = false) estado: String?,
        @PageableDefault(size = 10, sort = ["fechaPedido"]) pageable: Pageable
    ): ResponseEntity<PageResponse<PedidoResponse>> {
        return ResponseEntity.ok(pedidoService.findAllPedidos(pageable, estado))
    }

    @GetMapping("/{id}")
    fun getPedidoById(@PathVariable id: Long): ResponseEntity<PedidoResponse> {
        return ResponseEntity.ok(pedidoService.findPedidoById(id))
    }

    @PutMapping("/{id}/estado")
    fun updatePedidoEstado(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdatePedidoEstadoRequest
    ): ResponseEntity<PedidoResponse> {
        val pedidoActualizado = pedidoService.actualizarEstadoPedido(id, request.nuevoEstadoNombre)
        return ResponseEntity.ok(pedidoActualizado)
    }
}
