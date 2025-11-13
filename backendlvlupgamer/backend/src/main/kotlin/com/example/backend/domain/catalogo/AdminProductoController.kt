package com.example.backend.domain.catalogo

import com.example.backend.dto.CreateProductoRequest
import com.example.backend.dto.PageResponse
import com.example.backend.dto.ProductoResponse
import com.example.backend.dto.UpdateProductoRequest
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/productos")
@PreAuthorize("hasRole('ADMIN')") // Asegura que todos los métodos en este controlador requieren el rol ADMIN
class AdminProductoController(private val productoService: ProductoService) {

    @GetMapping
    fun getAllProductos(
        @RequestParam(required = false) query: String?,
        @RequestParam(required = false) categoriaId: Long?,
        @PageableDefault(size = 10, sort = ["nombre"]) pageable: Pageable
    ): ResponseEntity<PageResponse<ProductoResponse>> {
        return ResponseEntity.ok(productoService.search(pageable, query, categoriaId))
    }

    @GetMapping("/{id}")
    fun getProductoById(@PathVariable id: Long): ResponseEntity<ProductoResponse> {
        return ResponseEntity.ok(productoService.findById(id))
    }

    @PostMapping
    fun createProducto(@Valid @RequestBody request: CreateProductoRequest): ResponseEntity<ProductoResponse> {
        val nuevoProducto = productoService.createProducto(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto)
    }

    @PutMapping("/{id}")
    fun updateProducto(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateProductoRequest
    ): ResponseEntity<ProductoResponse> {
        val productoActualizado = productoService.updateProducto(id, request)
        return ResponseEntity.ok(productoActualizado)
    }

    @DeleteMapping("/{id}")
    fun deleteProducto(@PathVariable id: Long): ResponseEntity<Void> {
        productoService.deleteProducto(id)
        return ResponseEntity.noContent().build()
    }
}
