package com.example.backend.domain.evento

import com.example.backend.dto.CreateEventoRequest
import com.example.backend.dto.EventoResponse
import com.example.backend.dto.PageResponse
import com.example.backend.dto.UpdateEventoRequest
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/eventos")
@PreAuthorize("hasRole('ADMIN')") // Asegura que todos los métodos en este controlador requieren el rol ADMIN
class AdminEventoController(private val eventoService: EventoService) {

    @GetMapping // Nuevo endpoint para listar todos los eventos con paginación y filtrado
    fun getAllEventos(
        @RequestParam(required = false) query: String?,
        @PageableDefault(size = 10, sort = ["date"]) pageable: Pageable
    ): ResponseEntity<PageResponse<EventoResponse>> {
        return if (!query.isNullOrBlank()) {
            ResponseEntity.ok(eventoService.searchEventos(query, pageable))
        } else {
            ResponseEntity.ok(eventoService.findAll(pageable))
        }
    }

    @PostMapping
    fun createEvento(@Valid @RequestBody request: CreateEventoRequest): ResponseEntity<EventoResponse> {
        val nuevoEvento = eventoService.createEvento(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEvento)
    }

    @PutMapping("/{id}")
    fun updateEvento(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateEventoRequest
    ): ResponseEntity<EventoResponse> {
        val eventoActualizado = eventoService.updateEvento(id, request)
        return ResponseEntity.ok(eventoActualizado)
    }
}
