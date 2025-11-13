package com.example.backend.domain.catalogo

import com.example.backend.dto.CategoriaResponse
import com.example.backend.dto.PageResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/categorias")
class CategoriaController(private val categoriaService: CategoriaService) {

    @GetMapping
    fun getAllCategorias(
        @RequestParam(required = false) query: String?, // Añadir parámetro de query para filtrado
        @PageableDefault(size = 10, sort = ["nombre"]) pageable: Pageable // Añadir paginación
    ): ResponseEntity<PageResponse<CategoriaResponse>> {
        return if (!query.isNullOrBlank()) {
            ResponseEntity.ok(categoriaService.searchCategorias(query, pageable))
        } else {
            ResponseEntity.ok(categoriaService.findAll(pageable))
        }
    }
}
