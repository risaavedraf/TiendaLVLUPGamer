package com.example.backend.domain.usuario

import org.springframework.data.jpa.domain.Specification

object UsuarioSpecification {

    fun withSearchQuery(query: String?): Specification<Usuario> {
        return Specification { root, _, criteriaBuilder ->
            if (query.isNullOrBlank()) {
                criteriaBuilder.conjunction() // Siempre verdadero si no hay filtro
            } else {
                val lowerCaseQuery = "%${query.lowercase()}%"

                val usernameLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), lowerCaseQuery)
                val emailLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), lowerCaseQuery)

                criteriaBuilder.or(usernameLike, emailLike)
            }
        }
    }
}
