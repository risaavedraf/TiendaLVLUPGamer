package com.example.backend.domain.pedido

import org.springframework.data.jpa.domain.Specification
import jakarta.persistence.criteria.Join // Importar Join
import jakarta.persistence.criteria.Root // Importar Root

object PedidoSpecification {

    fun byEstado(estadoNombre: String?): Specification<Pedido> {
        return Specification { root: Root<Pedido>, _, criteriaBuilder -> // Especificar el tipo de Root
            if (estadoNombre.isNullOrBlank()) {
                criteriaBuilder.conjunction() // Siempre verdadero si no hay filtro
            } else {
                // Unir con la entidad EstadoPedido y filtrar por su nombre
                val estadoJoin: Join<Pedido, EstadoPedido> = root.join("estado") // Especificar el tipo de Join
                criteriaBuilder.equal(estadoJoin.get<String>("nombre"), estadoNombre)
            }
        }
    }
}
