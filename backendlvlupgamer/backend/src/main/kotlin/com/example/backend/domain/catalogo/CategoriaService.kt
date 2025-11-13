package com.example.backend.domain.catalogo

import com.example.backend.dto.CategoriaResponse
import com.example.backend.dto.CreateCategoriaRequest
import com.example.backend.dto.PageResponse
import com.example.backend.dto.toPageResponse
import com.example.backend.dto.toResponse
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CategoriaService(private val categoriaRepository: CategoriaRepository) {

    // Modificado para soportar paginación
    fun findAll(pageable: Pageable): PageResponse<CategoriaResponse> {
        val page = categoriaRepository.findAll(pageable)
        return page.toPageResponse { it.toResponse() }
    }

    // Añadido para soportar paginación y filtrado por query
    fun searchCategorias(query: String, pageable: Pageable): PageResponse<CategoriaResponse> {
        val spec = CategoriaSpecification.withSearchQuery(query)
        val page = categoriaRepository.findAll(spec, pageable)
        return page.toPageResponse { it.toResponse() }
    }

    @Transactional
    fun createCategoria(request: CreateCategoriaRequest): CategoriaResponse {
        val nuevaCategoria = Categoria(nombre = request.nombre)
        return categoriaRepository.save(nuevaCategoria).toResponse()
    }
}
