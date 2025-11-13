package com.example.backend.domain.pedido

import com.example.backend.domain.catalogo.Producto
import com.example.backend.domain.catalogo.ProductoRepository
import com.example.backend.domain.direccion.DireccionRepository
import com.example.backend.domain.usuario.UsuarioRepository
import com.example.backend.dto.CheckoutRequest
import com.example.backend.dto.PageResponse
import com.example.backend.dto.PedidoResponse
import com.example.backend.dto.toPageResponse
import com.example.backend.dto.toResponse
import com.example.backend.exception.ResourceNotFoundException
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class PedidoService(
    private val pedidoRepository: PedidoRepository,
    private val detallePedidoRepository: DetallePedidoRepository,
    private val usuarioRepository: UsuarioRepository,
    private val productoRepository: ProductoRepository,
    private val direccionRepository: DireccionRepository,
    private val estadoPedidoRepository: EstadoPedidoRepository
) {

    @Transactional
    fun checkout(request: CheckoutRequest, userEmail: String): PedidoResponse {
        val usuario = usuarioRepository.findByEmail(userEmail)
            .orElseThrow { ResourceNotFoundException("Usuario no encontrado con email $userEmail") }

        val direccion = direccionRepository.findById(request.direccionId)
            .orElseThrow { ResourceNotFoundException("Dirección no encontrada con id ${request.direccionId}") }

        // Verificar que la dirección pertenece al usuario
        if (direccion.usuario.id != usuario.id) {
            throw ResourceNotFoundException("La dirección no pertenece al usuario.")
        }

        val productosEnCarrito = mutableListOf<Pair<Producto, Int>>() // Pair de Producto y cantidad
        var totalPedido = 0.0

        // 1. Validar stock y calcular total
        for (itemRequest in request.items) {
            val producto = productoRepository.findById(itemRequest.productId)
                .orElseThrow { ResourceNotFoundException("Producto no encontrado con id ${itemRequest.productId}") }

            if (producto.stock < itemRequest.quantity) {
                throw IllegalArgumentException("Stock insuficiente para el producto '${producto.nombre}'. Stock disponible: ${producto.stock}, solicitado: ${itemRequest.quantity}")
            }
            
            totalPedido += producto.precio * itemRequest.quantity
            productosEnCarrito.add(Pair(producto, itemRequest.quantity))
        }

        // Buscar el estado "PENDIENTE"
        val estadoPendiente = estadoPedidoRepository.findByNombre("PENDIENTE")
            ?: throw IllegalStateException("Estado 'PENDIENTE' no encontrado en la base de datos. Asegúrate de que DataInitializer lo haya creado.")

        // 2. Crear el Pedido principal
        val pedido = Pedido(
            fechaPedido = LocalDateTime.now(),
            total = totalPedido,
            estado = estadoPendiente, // Asignar el objeto EstadoPedido
            direccionNombre = direccion.nombre,
            direccionNombreDestinatario = direccion.nombreDestinatario,
            direccionCalle = direccion.calle,
            direccionNumeroCasa = direccion.numeroCasa,
            direccionNumeroDepartamento = direccion.numeroDepartamento,
            direccionComuna = direccion.comuna,
            direccionCiudad = direccion.ciudad,
            direccionRegion = direccion.region,
            direccionCodigoPostal = direccion.codigoPostal,
            usuario = usuario
        )

        val savedPedido = pedidoRepository.save(pedido)

        // 3. Crear y guardar los DetallePedido, y restar stock
        productosEnCarrito.forEach { (producto, quantity) ->
            val detalle = DetallePedido(
                cantidad = quantity,
                precioUnitarioSnapshot = producto.precio,
                nombreProductoSnapshot = producto.nombre,
                producto = producto,
                pedido = savedPedido
            )
            detallePedidoRepository.save(detalle)

            // Restar stock
            producto.stock -= quantity
            productoRepository.save(producto)
        }
        
        return savedPedido.toResponse()
    }

    fun getPedidosByUsuario(userEmail: String): List<PedidoResponse> {
        return pedidoRepository.findByUsuarioEmailOrderByFechaPedidoDesc(userEmail).map { it.toResponse() }
    }

    // Modificado para soportar paginación y filtrado por estado
    fun findAllPedidos(pageable: Pageable, estadoNombre: String? = null): PageResponse<PedidoResponse> {
        val spec = PedidoSpecification.byEstado(estadoNombre)
        val page = pedidoRepository.findAll(spec, pageable)
        return page.toPageResponse { it.toResponse() }
    }

    fun findPedidoById(id: Long): PedidoResponse {
        val pedido = pedidoRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Pedido no encontrado con ID $id") }
        return pedido.toResponse()
    }

    @Transactional
    fun actualizarEstadoPedido(pedidoId: Long, nuevoEstadoNombre: String): PedidoResponse {
        val pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow { ResourceNotFoundException("Pedido no encontrado con ID $pedidoId") }

        val nuevoEstado = estadoPedidoRepository.findByNombre(nuevoEstadoNombre)
            ?: throw ResourceNotFoundException("Estado de pedido '$nuevoEstadoNombre' no encontrado.")

        pedido.estado = nuevoEstado
        return pedidoRepository.save(pedido).toResponse()
    }
}
