package com.example.backend.domain.catalogo

import jakarta.persistence.criteria.Predicate
import org.springframework.data.jpa.domain.Specification

object ProductoSpecification {

    fun build(query: String?, categoriaId: Long?): Specification<Producto> {
        return Specification { root, _, criteriaBuilder ->
            val predicates = mutableListOf<Predicate>()

            // Filtro por query de texto (nombre o descripción)
            if (!query.isNullOrBlank()) {
                val lowerCaseQuery = "%${query.lowercase()}%"
                val nombreLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("nombre")), lowerCaseQuery)
                val descripcionLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("descripcion")), lowerCaseQuery)
                predicates.add(criteriaBuilder.or(nombreLike, descripcionLike))
            }

            // Filtro por ID de categoría
            if (categoriaId != null) {
                val categoriaJoin = root.join<Producto, Categoria>("categoria")
                predicates.add(criteriaBuilder.equal(categoriaJoin.get<Long>("id"), categoriaId))
            }

            // Combinar todos los predicados con AND
            criteriaBuilder.and(*predicates.toTypedArray())
        }
    }
}
