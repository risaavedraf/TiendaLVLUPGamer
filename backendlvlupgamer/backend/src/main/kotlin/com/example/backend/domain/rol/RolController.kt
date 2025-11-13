package com.example.backend.domain.rol

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/roles")
class RolController(private val rolService: RolService) {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllRoles(): ResponseEntity<List<Rol>> {
        return ResponseEntity.ok(rolService.findAll())
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createRol(@RequestBody rol: Rol): ResponseEntity<Rol> {
        val nuevoRol = rolService.save(rol)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRol)
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteRol(@PathVariable id: Long): ResponseEntity<Void> {
        rolService.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}