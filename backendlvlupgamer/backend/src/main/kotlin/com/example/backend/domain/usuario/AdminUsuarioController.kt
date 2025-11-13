package com.example.backend.domain.usuario

import com.example.backend.dto.AsignarRolRequest
import com.example.backend.dto.PageResponse
import com.example.backend.dto.UsuarioResponse
import jakarta.validation.Valid
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/usuarios")
@PreAuthorize("hasRole('ADMIN')") // Asegura que todos los métodos en este controlador requieren el rol ADMIN
class AdminUsuarioController(private val usuarioService: UsuarioService) {

    @GetMapping
    fun getAllUsuariosWithRoles(
        @RequestParam(required = false) query: String?,
        @PageableDefault(size = 10, sort = ["username"]) pageable: Pageable
    ): ResponseEntity<PageResponse<UsuarioResponse>> {
        return ResponseEntity.ok(usuarioService.findAllUsuariosWithRoles(pageable, query))
    }

    @PostMapping("/{userId}/roles")
    fun asignarRolAUsuario(
        @PathVariable userId: Long,
        @Valid @RequestBody request: AsignarRolRequest
    ): ResponseEntity<UsuarioResponse> {
        val usuarioActualizado = usuarioService.asignarRolAUsuario(userId, request.rolId)
        return ResponseEntity.ok(usuarioActualizado)
    }
}
