package com.example.backend.domain.evento

import com.example.backend.dto.EventoResponse
import com.example.backend.dto.PageResponse
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/eventos")
class EventoController(private val eventoService: EventoService) {

    @GetMapping
    fun getAllEventos(
        @RequestParam(required = false) query: String?, // Añadir parámetro de query para filtrado
        @PageableDefault(size = 10, sort = ["date"]) pageable: Pageable // Añadir paginación
    ): ResponseEntity<PageResponse<EventoResponse>> {
        return if (!query.isNullOrBlank()) {
            ResponseEntity.ok(eventoService.searchEventos(query, pageable))
        } else {
            ResponseEntity.ok(eventoService.findAll(pageable))
        }
    }

    @GetMapping("/{id}")
    fun getEventoById(@PathVariable id: Long): ResponseEntity<EventoResponse> {
        return ResponseEntity.ok(eventoService.findById(id))
    }
}
