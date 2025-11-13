package com.example.backend.dto

import com.example.backend.domain.catalogo.Categoria
import com.example.backend.domain.catalogo.Producto
import com.example.backend.domain.catalogo.ProductoImagen
import com.example.backend.domain.direccion.Direccion
import com.example.backend.domain.evento.Evento
import com.example.backend.domain.evento.EventoImagen
import com.example.backend.domain.pedido.DetallePedido
import com.example.backend.domain.pedido.Pedido
import com.example.backend.domain.review.Review
import com.example.backend.domain.rol.Rol
import com.example.backend.domain.usuario.Usuario
import org.springframework.data.domain.Page
import java.time.LocalDateTime

// --- Mappers de Catálogo ---

fun Categoria.toResponse(): CategoriaResponse {
    return CategoriaResponse(
        id = this.id!!,
        nombre = this.nombre,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun Producto.toResponse(imagenUrl: String? = null): ProductoResponse {
    return ProductoResponse(
        id = this.id!!,
        nombre = this.nombre,
        descripcion = this.descripcion,
        precio = this.precio,
        stock = this.stock,
        categoria = this.categoria.toResponse(),
        imagenUrl = imagenUrl,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

// --- Mapper de Review ---

fun Review.toResponse(): ReviewResponse {
    return ReviewResponse(
        id = this.id!!,
        calificacion = this.calificacion,
        comentario = this.comentario,
        fecha = this.fecha,
        author = this.usuario.username,
        authorId = this.usuario.id!!,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

// --- Mappers de Usuario y Dirección ---

fun Usuario.toResponse(profileImageBase64: String? = null): UsuarioResponse {
    return UsuarioResponse(
        id = this.id!!,
        username = this.username,
        email = this.email,
        roles = this.roles.map { it.nombre }.toSet(),
        name = this.name,
        lastName = this.lastName,
        birthDate = this.birthDate,
        profileImageBase64 = profileImageBase64,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun Usuario.toPedidoResponse(): UsuarioPedidoResponse {
    return UsuarioPedidoResponse(
        id = this.id!!,
        username = this.username
    )
}

fun Direccion.toResponse(): DireccionResponse {
    return DireccionResponse(
        id = this.id!!,
        nombre = this.nombre,
        nombreDestinatario = this.nombreDestinatario,
        calle = this.calle,
        numeroCasa = this.numeroCasa,
        numeroDepartamento = this.numeroDepartamento,
        comuna = this.comuna,
        ciudad = this.ciudad,
        region = this.region,
        codigoPostal = this.codigoPostal,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

// --- Mappers de Pedido ---

fun Pedido.toResponse(): PedidoResponse {
    return PedidoResponse(
        id = this.id!!,
        fechaPedido = this.fechaPedido,
        total = this.total,
        estado = this.estado.nombre,
        direccion = DireccionResponse( // Crear DireccionResponse a partir del snapshot
            id = 0, // No hay ID real para la dirección snapshot
            nombre = this.direccionNombre,
            nombreDestinatario = this.direccionNombreDestinatario,
            calle = this.direccionCalle,
            numeroCasa = this.direccionNumeroCasa,
            numeroDepartamento = this.direccionNumeroDepartamento,
            comuna = this.direccionComuna,
            ciudad = this.direccionCiudad,
            region = this.direccionRegion,
            codigoPostal = this.direccionCodigoPostal,
            createdAt = null, // Asignar null para el snapshot
            updatedAt = null // Asignar null para el snapshot
        ),
        detalles = this.detalles.map { it.toResponse() },
        usuario = this.usuario.toPedidoResponse(),
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun DetallePedido.toResponse(): DetallePedidoResponse {
    return DetallePedidoResponse(
        productId = this.producto.id!!,
        productName = this.nombreProductoSnapshot,
        quantity = this.cantidad,
        unitPrice = this.precioUnitarioSnapshot,
        subtotal = this.cantidad * this.precioUnitarioSnapshot,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun Evento.toResponse(imageUrl: String? = null): EventoResponse {
    return EventoResponse(
        id = this.id!!,
        name = this.name,
        description = this.description,
        date = this.date,
        locationName = this.locationName,
        latitude = this.latitude,
        longitude = this.longitude,
        imageUrl = imageUrl,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun EventoImagen.toResponse(): EventoImagenResponse {
    return EventoImagenResponse(
        id = this.id!!,
        filename = this.filename,
        contentType = this.contentType,
        size = this.size,
        uploadedAt = this.uploadedAt,
        isPrincipal = this.isPrincipal,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun ProductoImagen.toResponse(): ProductoImagenResponse {
    return ProductoImagenResponse(
        id = this.id!!,
        filename = this.filename,
        contentType = this.contentType,
        size = this.size,
        uploadedAt = this.uploadedAt,
        isPrincipal = this.isPrincipal,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

fun Rol.toResponse(): RolResponse {
    return RolResponse(
        id = this.id!!,
        nombre = this.nombre,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt
    )
}

// --- Mapper para Page de Spring Data a PageResponse personalizado ---
fun <T, R> Page<T>.toPageResponse(contentMapper: (T) -> R): PageResponse<R> {
    return PageResponse(
        content = this.content.map(contentMapper),
        pageNumber = this.number,
        pageSize = this.size,
        totalElements = this.totalElements,
        totalPages = this.totalPages,
        isLast = this.isLast
    )
}
