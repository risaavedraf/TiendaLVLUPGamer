package com.example.backend.domain.usuario

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.security.Principal

@RestController
@RequestMapping("/api/usuarios/{id}/images")
class UsuarioImagenController(
    private val imagenService: UsuarioImagenService
    // No necesitas UsuarioRepository aquí
) {

    @PostMapping
    fun upload(
        @PathVariable id: Long,
        @RequestParam("file") file: MultipartFile,
        @RequestParam("profile", required = false, defaultValue = "false") profile: Boolean,
        principal: Principal // Inyecta Principal
    ): ResponseEntity<UsuarioImagen> {
        // Delega la autorización y la lógica al servicio
        val saved = imagenService.saveImage(id, file, profile, principal.name)
        return ResponseEntity.ok(saved)
    }

    @GetMapping
    fun list(@PathVariable id: Long, principal: Principal): ResponseEntity<List<UsuarioImagen>> {
        // Delega la autorización y la lógica al servicio
        val images = imagenService.listImages(id, principal.name)
        return ResponseEntity.ok(images)
    }

    @GetMapping("/{imageId}/base64")
    fun getBase64(@PathVariable id: Long, @PathVariable imageId: Long, principal: Principal): ResponseEntity<String> {
        // Delega la autorización y la lógica al servicio
        val dataUrl = imagenService.getImageBase64(id, imageId, principal.name)
        return ResponseEntity.ok(dataUrl)
    }
}