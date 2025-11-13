package com.example.backend.domain.review

import com.example.backend.dto.ReviewRequest
import com.example.backend.dto.ReviewResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/api/productos/{productoId}/reviews")
class ReviewController(private val reviewService: ReviewService) {

    @GetMapping
    fun getReviewsForProducto(@PathVariable productoId: Long): ResponseEntity<List<ReviewResponse>> {
        val reviews = reviewService.findByProductoId(productoId)
        return ResponseEntity.ok(reviews)
    }

    @PostMapping
    fun createReview(
        @PathVariable productoId: Long,
        @Valid @RequestBody request: ReviewRequest,
        principal: Principal
    ): ResponseEntity<ReviewResponse> {
        val nuevaReview = reviewService.createReview(productoId, principal.name, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReview)
    }
}