package com.example.backend.domain.usuario

import com.example.backend.domain.direccion.DireccionRepository
import com.example.backend.domain.review.ReviewRepository
import com.example.backend.dto.FullProfileResponse
import com.example.backend.dto.UpdateProfileRequest
import com.example.backend.dto.UsuarioResponse
import com.example.backend.dto.toResponse
import com.example.backend.exception.ResourceNotFoundException
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class ProfileService(
    private val usuarioRepository: UsuarioRepository,
    private val imagenRepo: UsuarioImagenRepository,
    private val direccionRepository: DireccionRepository, // Inyectar
    private val reviewRepository: ReviewRepository // Inyectar
) {
    fun getProfile(email: String): FullProfileResponse { // <-- CAMBIO AQUÍ
        val usuario = usuarioRepository.findByEmail(email)
            .orElseThrow { ResourceNotFoundException("Usuario no encontrado con email $email") }

        val profileImage = imagenRepo.findByUsuarioIdAndProfileTrue(usuario.id!!)
        val profileBase64 = profileImage?.let { "data:${it.contentType};base64:${java.util.Base64.getEncoder().encodeToString(it.data)}" }

        val direcciones = direccionRepository.findByUsuarioEmail(email).map { it.toResponse() }
        val reviews = reviewRepository.findByUsuarioId(usuario.id!!).map { it.toResponse() }

        return FullProfileResponse(
            id = usuario.id!!,
            username = usuario.username,
            email = usuario.email,
            roles = usuario.roles.map { it.nombre }.toSet(),
            name = usuario.name,
            lastName = usuario.lastName,
            birthDate = usuario.birthDate,
            profileImageBase64 = profileBase64,
            direcciones = direcciones,
            reviews = reviews
        )
    }

    fun updateProfile(email: String, request: UpdateProfileRequest): UsuarioResponse {
        val usuario = usuarioRepository.findByEmail(email)
            .orElseThrow { ResourceNotFoundException("Usuario no encontrado con email $email") }

        usuario.name = request.name
        usuario.lastName = request.lastName
        usuario.birthDate = request.birthDate?.let { LocalDate.parse(it) }

        val usuarioGuardado = usuarioRepository.save(usuario)

        val profileImage = imagenRepo.findByUsuarioIdAndProfileTrue(usuarioGuardado.id!!)
        val profileBase64 = profileImage?.let { "data:${it.contentType};base64:${java.util.Base64.getEncoder().encodeToString(it.data)}" }

        return usuarioGuardado.toResponse(profileBase64)
    }
}