package com.example.backend.domain.direccion

import com.example.backend.dto.DireccionRequest
import com.example.backend.dto.DireccionResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/api/direcciones")
class DireccionController(private val direccionService: DireccionService) {

    @GetMapping
    fun getMisDirecciones(principal: Principal): ResponseEntity<List<DireccionResponse>> {
        val direcciones = direccionService.findAllByUsuario(principal.name)
        return ResponseEntity.ok(direcciones)
    }

    @GetMapping("/{id}") // Nuevo endpoint
    fun getDireccionById(
        @PathVariable id: Long,
        principal: Principal
    ): ResponseEntity<DireccionResponse> {
        val direccion = direccionService.findById(id, principal.name)
        return ResponseEntity.ok(direccion)
    }

    @PostMapping
    fun createDireccion(
        @Valid @RequestBody request: DireccionRequest,
        principal: Principal
    ): ResponseEntity<DireccionResponse> {
        val nuevaDireccion = direccionService.save(request, principal.name)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaDireccion)
    }

    @PutMapping("/{id}")
    fun updateDireccion(
        @PathVariable id: Long,
        @Valid @RequestBody request: DireccionRequest,
        principal: Principal
    ): ResponseEntity<DireccionResponse> {
        val direccionActualizada = direccionService.update(id, request, principal.name)
        return ResponseEntity.ok(direccionActualizada)
    }

    @DeleteMapping("/{id}")
    fun deleteDireccion(
        @PathVariable id: Long,
        principal: Principal
    ): ResponseEntity<Void> {
        direccionService.delete(id, principal.name)
        return ResponseEntity.noContent().build()
    }
}
