package com.example.backend.domain.usuario

import com.example.backend.domain.rol.RolRepository
import com.example.backend.dto.*
import com.example.backend.exception.DuplicateResourceException
import com.example.backend.exception.ResourceNotFoundException
import com.example.backend.security.CustomUserDetails
import com.example.backend.security.JwtTokenProvider
import org.springframework.data.domain.Pageable
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.format.DateTimeParseException

@Service
class UsuarioService(
    private val usuarioRepository: UsuarioRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManager: AuthenticationManager,
    private val imagenRepo: UsuarioImagenRepository,
    private val rolRepository: RolRepository
) {

    fun registrar(req: RegistroRequest): UsuarioResponse {
        if (usuarioRepository.existsByUsername(req.username)) {
            throw DuplicateResourceException("El nombre de usuario '${req.username}' ya está en uso.")
        }
        if (usuarioRepository.existsByEmail(req.email)) {
            throw DuplicateResourceException("El email '${req.email}' ya está registrado.")
        }

        val fechaNacimiento: LocalDate? = try {
            req.birthDate?.let { LocalDate.parse(it) }
        } catch (e: DateTimeParseException) {
            throw IllegalArgumentException("Formato de fecha inválido. Usar YYYY-MM-DD.")
        }

        val userRole = rolRepository.findByNombre("ROLE_USER")
            .orElseThrow { ResourceNotFoundException("El rol por defecto 'ROLE_USER' no se encuentra en la base de datos.") }

        val usuario = Usuario(
            username = req.username,
            email = req.email,
            passwordHash = passwordEncoder.encode(req.password),
            name = req.name,
            lastName = req.lastName,
            birthDate = fechaNacimiento,
            roles = mutableSetOf(userRole)
        )
        val usuarioGuardado = usuarioRepository.save(usuario)
        
        val profile = imagenRepo.findByUsuarioIdAndProfileTrue(usuarioGuardado.id!!)
        val profileBase64 = profile?.let { "data:${it.contentType};base64:${java.util.Base64.getEncoder().encodeToString(it.data)}" }
        
        return usuarioGuardado.toResponse(profileBase64)
    }

    fun login(req: LoginRequest): LoginResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(req.email, req.password)
        )

        SecurityContextHolder.getContext().authentication = authentication

        val userDetails = authentication.principal as CustomUserDetails
        val usuario = userDetails.usuario

        val token = jwtTokenProvider.generateToken(userDetails)

        val profile = imagenRepo.findByUsuarioIdAndProfileTrue(usuario.id!!)
        val profileBase64 = profile?.let { "data:${it.contentType};base64:${java.util.Base64.getEncoder().encodeToString(it.data)}" }

        return LoginResponse(token = token, usuario = usuario.toResponse(profileBase64))
    }

    // Modificado para soportar paginación y filtrado por query
    fun findAllUsuariosWithRoles(pageable: Pageable, query: String? = null): PageResponse<UsuarioResponse> {
        val spec = UsuarioSpecification.withSearchQuery(query)
        val page = usuarioRepository.findAll(spec, pageable)
        return page.toPageResponse { usuario ->
            val profile = imagenRepo.findByUsuarioIdAndProfileTrue(usuario.id!!)
            val profileBase64 = profile?.let { "data:${it.contentType};base64:${java.util.Base64.getEncoder().encodeToString(it.data)}" }
            usuario.toResponse(profileBase64)
        }
    }

    @Transactional
    fun asignarRolAUsuario(userId: Long, rolId: Long): UsuarioResponse {
        val usuario = usuarioRepository.findById(userId)
            .orElseThrow { ResourceNotFoundException("Usuario no encontrado con ID $userId") }

        val rol = rolRepository.findById(rolId)
            .orElseThrow { ResourceNotFoundException("Rol no encontrado con ID $rolId") }

        usuario.roles.add(rol) // Añadir el rol al conjunto de roles del usuario
        val usuarioActualizado = usuarioRepository.save(usuario)

        val profile = imagenRepo.findByUsuarioIdAndProfileTrue(usuarioActualizado.id!!)
        val profileBase64 = profile?.let { "data:${it.contentType};base64:${java.util.Base64.getEncoder().encodeToString(it.data)}" }

        return usuarioActualizado.toResponse(profileBase64)
    }
}
