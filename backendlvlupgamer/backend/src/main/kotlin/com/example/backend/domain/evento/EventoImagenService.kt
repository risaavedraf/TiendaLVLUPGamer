package com.example.backend.domain.evento

import com.example.backend.exception.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.OffsetDateTime
import java.util.Base64

@Service
class EventoImagenService(
    private val eventoRepository: EventoRepository,
    private val imagenRepository: EventoImagenRepository
) {

    @Transactional
    fun saveImage(eventoId: Long, file: MultipartFile, isPrincipal: Boolean): EventoImagen {
        val evento = eventoRepository.findById(eventoId)
            .orElseThrow { ResourceNotFoundException("Evento no encontrado con id $eventoId") }

        val bytes = file.bytes
        val maxBytes = 10 * 1024 * 1024 // 10 MB
        if (bytes.size > maxBytes) throw IllegalArgumentException("Archivo demasiado grande (max 10MB)")

        if (isPrincipal) {
            imagenRepository.resetPrincipalImage(eventoId)
        }

        val imagen = EventoImagen(
            filename = file.originalFilename ?: "image",
            contentType = file.contentType ?: "application/octet-stream",
            data = bytes,
            size = bytes.size.toLong(),
            uploadedAt = OffsetDateTime.now(),
            isPrincipal = isPrincipal,
            evento = evento
        )
        return imagenRepository.save(imagen)
    }

    fun getImageBase64(eventoId: Long, imageId: Long): String {
        val img = imagenRepository.findById(imageId)
            .orElseThrow { ResourceNotFoundException("Imagen no encontrada con id $imageId") }

        if (img.evento.id != eventoId) {
            throw ResourceNotFoundException("La imagen no pertenece al evento especificado.")
        }

        val encoded = Base64.getEncoder().encodeToString(img.data)
        return "data:${img.contentType};base64,$encoded"
    }
}