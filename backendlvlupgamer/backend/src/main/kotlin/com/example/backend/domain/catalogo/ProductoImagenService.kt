package com.example.backend.domain.catalogo

import com.example.backend.exception.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.time.OffsetDateTime
import java.util.Base64

@Service
class ProductoImagenService(
    private val productoRepository: ProductoRepository,
    private val imagenRepository: ProductoImagenRepository
) {

    @Transactional
    fun saveImage(productoId: Long, file: MultipartFile, isPrincipal: Boolean): ProductoImagen {
        val producto = productoRepository.findById(productoId)
            .orElseThrow { ResourceNotFoundException("Producto no encontrado con id $productoId") }

        val bytes = file.bytes
        val maxBytes = 10 * 1024 * 1024 // 10 MB
        if (bytes.size > maxBytes) throw IllegalArgumentException("Archivo demasiado grande (max 10MB)")

        if (isPrincipal) {
            imagenRepository.resetPrincipalImage(productoId)
        }

        val imagen = ProductoImagen(
            filename = file.originalFilename ?: "image",
            contentType = file.contentType ?: "application/octet-stream",
            data = bytes,
            size = bytes.size.toLong(),
            uploadedAt = OffsetDateTime.now(),
            isPrincipal = isPrincipal,
            producto = producto
        )
        return imagenRepository.save(imagen)
    }

    fun getImageBase64(productoId: Long, imageId: Long): String {
        val img = imagenRepository.findById(imageId)
            .orElseThrow { ResourceNotFoundException("Imagen no encontrada con id $imageId") }

        if (img.producto.id != productoId) {
            throw ResourceNotFoundException("La imagen no pertenece al producto especificado.")
        }

        val encoded = Base64.getEncoder().encodeToString(img.data)
        return "data:${img.contentType};base64,$encoded"
    }
}