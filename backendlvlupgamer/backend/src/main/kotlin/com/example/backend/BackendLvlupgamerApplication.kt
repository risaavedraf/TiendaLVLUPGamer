package com.example.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing // Importar EnableJpaAuditing

@SpringBootApplication
@EnableJpaAuditing // Habilitar la auditoría de JPA
class BackendLvlupgamerApplication

fun main(args: Array<String>) {
	runApplication<BackendLvlupgamerApplication>(*args)
}
