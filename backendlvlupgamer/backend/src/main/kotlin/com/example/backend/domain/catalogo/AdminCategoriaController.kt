package com.example.backend.domain.catalogo

import com.example.backend.dto.CategoriaResponse
import com.example.backend.dto.CreateCategoriaRequest
import com.example.backend.dto.PageResponse
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/categorias")
@PreAuthorize("hasRole('ADMIN')") // Asegura que todos los métodos en este controlador requieren el rol ADMIN
class AdminCategoriaController(private val categoriaService: CategoriaService) {

    @GetMapping // Nuevo endpoint para listar todas las categorías con paginación y filtrado
    fun getAllCategorias(
        @RequestParam(required = false) query: String?,
        @PageableDefault(size = 10, sort = ["nombre"]) pageable: Pageable
    ): ResponseEntity<PageResponse<CategoriaResponse>> {
        return if (!query.isNullOrBlank()) {
            ResponseEntity.ok(categoriaService.searchCategorias(query, pageable))
        } else {
            ResponseEntity.ok(categoriaService.findAll(pageable))
        }
    }

    @PostMapping
    fun createCategoria(@Valid @RequestBody request: CreateCategoriaRequest): ResponseEntity<CategoriaResponse> {
        val nuevaCategoria = categoriaService.createCategoria(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria)
    }
}
