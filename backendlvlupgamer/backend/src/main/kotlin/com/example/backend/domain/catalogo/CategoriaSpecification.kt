package com.example.backend.domain.catalogo

import org.springframework.data.jpa.domain.Specification

object CategoriaSpecification {

    fun withSearchQuery(query: String): Specification<Categoria> {
        return Specification { root, _, criteriaBuilder ->
            val lowerCaseQuery = "%${query.lowercase()}%"
            criteriaBuilder.like(criteriaBuilder.lower(root.get("nombre")), lowerCaseQuery)
        }
    }
}
