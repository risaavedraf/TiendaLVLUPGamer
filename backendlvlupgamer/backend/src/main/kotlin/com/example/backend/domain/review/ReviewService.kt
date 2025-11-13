package com.example.backend.domain.review

import com.example.backend.domain.catalogo.ProductoRepository
import com.example.backend.domain.usuario.UsuarioRepository
import com.example.backend.dto.ReviewRequest
import com.example.backend.dto.ReviewResponse
import com.example.backend.dto.toResponse // Importar
import com.example.backend.exception.DuplicateResourceException
import com.example.backend.exception.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val productoRepository: ProductoRepository,
    private val usuarioRepository: UsuarioRepository
) {

    fun findByProductoId(productoId: Long): List<ReviewResponse> {
        if (!productoRepository.existsById(productoId)) {
            throw ResourceNotFoundException("Producto no encontrado con id $productoId")
        }
        return reviewRepository.findByProductoId(productoId).map { it.toResponse() }
    }

    @Transactional
    fun createReview(productoId: Long, userEmail: String, request: ReviewRequest): ReviewResponse {
        val usuario = usuarioRepository.findByEmail(userEmail)
            .orElseThrow { ResourceNotFoundException("Usuario no encontrado con email $userEmail") }

        val producto = productoRepository.findById(productoId)
            .orElseThrow { ResourceNotFoundException("Producto no encontrado con id $productoId") }

        if (reviewRepository.existsByProductoIdAndUsuarioId(productoId, usuario.id!!)) {
            throw DuplicateResourceException("Ya has dejado una reseña para este producto.")
        }

        val review = Review(
            calificacion = request.calificacion,
            comentario = request.comentario,
            usuario = usuario,
            producto = producto
        )

        val savedReview = reviewRepository.save(review)
        return savedReview.toResponse()
    }
}

// Se elimina la función toResponse de aquí