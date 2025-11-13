package com.example.backend.domain.catalogo

import com.example.backend.dto.CreateProductoRequest
import com.example.backend.dto.PageResponse
import com.example.backend.dto.ProductoResponse
import com.example.backend.dto.UpdateProductoRequest
import com.example.backend.dto.toPageResponse
import com.example.backend.dto.toResponse
import com.example.backend.exception.ResourceNotFoundException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProductoService(
    private val productoRepository: ProductoRepository,
    private val imagenRepository: ProductoImagenRepository,
    private val categoriaRepository: CategoriaRepository
) {

    // Método unificado para búsqueda y listado
    fun search(pageable: Pageable, query: String?, categoriaId: Long?): PageResponse<ProductoResponse> {
        val spec = ProductoSpecification.build(query, categoriaId)
        val page = productoRepository.findAll(spec, pageable)
        return page.toPageResponse { toResponseWithImage(it) }
    }

    fun findById(id: Long): ProductoResponse {
        val producto = productoRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Producto no encontrado con id $id") }
        return toResponseWithImage(producto)
    }

    @Transactional
    fun createProducto(request: CreateProductoRequest): ProductoResponse {
        val categoria = categoriaRepository.findById(request.categoriaId)
            .orElseThrow { ResourceNotFoundException("Categoría no encontrada con ID ${request.categoriaId}") }

        val nuevoProducto = Producto(
            nombre = request.nombre,
            descripcion = request.descripcion,
            precio = request.precio,
            stock = request.stock,
            categoria = categoria
        )
        return productoRepository.save(nuevoProducto).let { toResponseWithImage(it) }
    }

    @Transactional
    fun updateProducto(id: Long, request: UpdateProductoRequest): ProductoResponse {
        val producto = productoRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Producto no encontrado con ID $id") }

        request.nombre?.let { producto.nombre = it }
        request.descripcion?.let { producto.descripcion = it }
        request.precio?.let { producto.precio = it }
        request.stock?.let { producto.stock = it }
        request.categoriaId?.let {
            val categoria = categoriaRepository.findById(it)
                .orElseThrow { ResourceNotFoundException("Categoría no encontrada con ID $it") }
            producto.categoria = categoria
        }

        return productoRepository.save(producto).let { toResponseWithImage(it) }
    }

    @Transactional
    fun deleteProducto(id: Long) {
        if (!productoRepository.existsById(id)) {
            throw ResourceNotFoundException("Producto no encontrado con ID $id")
        }
        productoRepository.deleteById(id)
    }

    private fun toResponseWithImage(producto: Producto): ProductoResponse {
        val imagenPrincipal = imagenRepository.findByProductoIdAndIsPrincipalTrue(producto.id!!)
        val imagenUrl = imagenPrincipal.map { "/api/productos/${producto.id}/imagenes/${it.id!!}/base64" }.orElse(null)
        
        return producto.toResponse(imagenUrl)
    }
}
