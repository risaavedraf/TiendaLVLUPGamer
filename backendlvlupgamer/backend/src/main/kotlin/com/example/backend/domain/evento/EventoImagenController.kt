package com.example.backend.domain.evento

import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/eventos/{eventoId}/imagenes")
class EventoImagenController(
    private val imagenService: EventoImagenService
) {

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun uploadImage(
        @PathVariable eventoId: Long,
        @RequestParam("file") file: MultipartFile,
        @RequestParam("isPrincipal", defaultValue = "false") isPrincipal: Boolean
    ): ResponseEntity<Any> {
        imagenService.saveImage(eventoId, file, isPrincipal)
        return ResponseEntity.ok().build()
    }

    @GetMapping("/{imageId}/base64")
    fun getImageAsBase64(
        @PathVariable eventoId: Long,
        @PathVariable imageId: Long
    ): ResponseEntity<String> {
        val base64Image = imagenService.getImageBase64(eventoId, imageId)
        return ResponseEntity.ok(base64Image)
    }
}