package com.example.backend.domain.evento

import org.springframework.data.jpa.domain.Specification

object EventoSpecification {

    fun withSearchQuery(query: String): Specification<Evento> {
        return Specification { root, _, criteriaBuilder ->
            val lowerCaseQuery = "%${query.lowercase()}%"

            val nameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), lowerCaseQuery)
            val descriptionLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), lowerCaseQuery)
            val locationNameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("locationName")), lowerCaseQuery)

            criteriaBuilder.or(nameLike, descriptionLike, locationNameLike)
        }
    }
}
