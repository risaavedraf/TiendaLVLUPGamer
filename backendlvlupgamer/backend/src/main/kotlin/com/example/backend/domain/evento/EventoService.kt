package com.example.backend.domain.evento

import com.example.backend.dto.CreateEventoRequest
import com.example.backend.dto.EventoResponse
import com.example.backend.dto.PageResponse
import com.example.backend.dto.UpdateEventoRequest
import com.example.backend.dto.toPageResponse
import com.example.backend.dto.toResponse
import com.example.backend.exception.ResourceNotFoundException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EventoService(
    private val eventoRepository: EventoRepository,
    private val eventoImagenRepository: EventoImagenRepository
) {

    // Modificado para soportar paginación
    fun findAll(pageable: Pageable): PageResponse<EventoResponse> {
        val page = eventoRepository.findAll(pageable)
        return page.toPageResponse { toResponseWithImage(it) }
    }

    fun findById(id: Long): EventoResponse {
        val evento = eventoRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Evento no encontrado con id $id") }
        return toResponseWithImage(evento)
    }

    // Añadido para soportar paginación y filtrado por query
    fun searchEventos(query: String, pageable: Pageable): PageResponse<EventoResponse> {
        val spec = EventoSpecification.withSearchQuery(query)
        val page = eventoRepository.findAll(spec, pageable)
        return page.toPageResponse { toResponseWithImage(it) }
    }

    @Transactional
    fun createEvento(request: CreateEventoRequest): EventoResponse {
        val nuevoEvento = Evento(
            name = request.name,
            description = request.description,
            date = request.date,
            locationName = request.locationName,
            latitude = request.latitude,
            longitude = request.longitude
        )
        return eventoRepository.save(nuevoEvento).let { toResponseWithImage(it) }
    }

    @Transactional
    fun updateEvento(id: Long, request: UpdateEventoRequest): EventoResponse {
        val evento = eventoRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Evento no encontrado con ID $id") }

        request.name?.let { evento.name = it }
        request.description?.let { evento.description = it }
        request.date?.let { evento.date = it }
        request.locationName?.let { evento.locationName = it }
        request.latitude?.let { evento.latitude = it }
        request.longitude?.let { evento.longitude = it }

        return eventoRepository.save(evento).let { toResponseWithImage(it) }
    }

    private fun toResponseWithImage(evento: Evento): EventoResponse {
        val imagenPrincipal = eventoImagenRepository.findByEventoIdAndIsPrincipalTrue(evento.id!!)
        val imageUrl = imagenPrincipal.map { "/api/eventos/${evento.id}/imagenes/${it.id!!}/base64" }.orElse(null)

        return evento.toResponse(imageUrl)
    }
}
