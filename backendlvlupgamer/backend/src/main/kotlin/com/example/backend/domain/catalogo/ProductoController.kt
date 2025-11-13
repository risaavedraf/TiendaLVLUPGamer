package com.example.backend.domain.catalogo

import com.example.backend.dto.PageResponse
import com.example.backend.dto.ProductoResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/productos")
class ProductoController(private val productoService: ProductoService) {

    @GetMapping
    fun searchProductos(
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
}
