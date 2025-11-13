package com.example.backend.domain.rol

import com.example.backend.exception.DuplicateResourceException
import org.springframework.stereotype.Service

@Service
class RolService(private val rolRepository: RolRepository) {

    fun findAll(): List<Rol> {
        return rolRepository.findAll()
    }

    fun save(rol: Rol): Rol {
        if (rolRepository.findByNombre(rol.nombre).isPresent) {
            throw DuplicateResourceException("El rol '${rol.nombre}' ya existe.")
        }
        return rolRepository.save(rol)
    }

    fun deleteById(id: Long) {
        // Opcional: Añadir lógica para verificar si el rol está en uso antes de borrarlo.
        // Por ahora, lo mantenemos simple.
        rolRepository.deleteById(id)
    }
}