package com.example.backend.domain.common

import jakarta.persistence.Column
import jakarta.persistence.EntityListeners
import jakarta.persistence.MappedSuperclass
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@MappedSuperclass // Indica que esta clase es una superclase mapeada y sus atributos se incluirán en las tablas de las subclases.
@EntityListeners(AuditingEntityListener::class) // Habilita la escucha de eventos de auditoría para esta entidad.
abstract class BaseAuditableEntity(
    @CreatedDate // Anotación de Spring Data JPA para marcar el campo como fecha de creación.
    @Column(nullable = false, updatable = false) // La columna no puede ser nula y no se puede actualizar manualmente.
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @LastModifiedDate // Anotación de Spring Data JPA para marcar el campo como fecha de última modificación.
    @Column(nullable = false) // La columna no puede ser nula.
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
