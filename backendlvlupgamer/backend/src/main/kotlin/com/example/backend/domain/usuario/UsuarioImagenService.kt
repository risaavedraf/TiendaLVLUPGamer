package com.example.backend.domain.usuario

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus
import org.springframework.web.multipart.MultipartFile
import java.time.OffsetDateTime
import java.util.Base64

@Service
class UsuarioImagenService(
    private val usuarioRepository: UsuarioRepository,
    private val imagenRepo: UsuarioImagenRepository
) {

    private fun authorizeUser(usuarioId: Long, email: String) {
        val usuario = usuarioRepository.findByEmail(email).orElseThrow {
            ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado")
        }

        if (usuario.id != usuarioId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para acceder a este recurso")
        }
    }

    @Transactional
    fun saveImage(usuarioId: Long, file: MultipartFile, profile: Boolean = false, userEmail: String): UsuarioImagen {
        authorizeUser(usuarioId, userEmail)
        val usuario = usuarioRepository.findById(usuarioId).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado") }

        val bytes = try { file.bytes } catch (ex: Exception) { throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al leer el archivo") }

        val maxBytes = 5_242_880L // 5 MB
        if (bytes.size.toLong() > maxBytes) throw ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Archivo demasiado grande (max 5MB)")

        val allowed = setOf("image/png", "image/jpeg", "image/jpg", "image/webp")
        val ct = file.contentType ?: ""
        if (!allowed.contains(ct.lowercase())) throw ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Tipo de archivo no permitido")

        if (profile) {
            imagenRepo.resetProfileImages(usuarioId)
        }

        val img = UsuarioImagen(
            filename = file.originalFilename ?: "image",
            contentType = file.contentType ?: "application/octet-stream",
            data = bytes,
            size = bytes.size.toLong(),
            uploadedAt = OffsetDateTime.now(),
            profile = profile,
            usuario = usuario
        )

        return imagenRepo.save(img)
    }

    fun getImageBase64(usuarioId: Long, imageId: Long, userEmail: String): String {
        authorizeUser(usuarioId, userEmail)
        val img = imagenRepo.findById(imageId).orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Imagen no encontrada") }
        if (img.usuario?.id != usuarioId) throw ResponseStatusException(HttpStatus.FORBIDDEN, "Imagen no pertenece al usuario")
        val encoded = Base64.getEncoder().encodeToString(img.data)
        return "data:${img.contentType};base64,$encoded"
    }

    fun listImages(usuarioId: Long, userEmail: String): List<UsuarioImagen> {
        authorizeUser(usuarioId, userEmail)
        return imagenRepo.findByUsuarioId(usuarioId)
    }
}