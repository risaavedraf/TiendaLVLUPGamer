package com.example.backend.domain.carrito

import org.springframework.data.jpa.repository.JpaRepository

interface CarritoItemRepository : JpaRepository<CarritoItem, Long>
