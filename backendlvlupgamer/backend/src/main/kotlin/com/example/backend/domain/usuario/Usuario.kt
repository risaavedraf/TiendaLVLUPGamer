package com.example.backend.domain.usuario

import com.example.backend.domain.common.BaseAuditableEntity
import com.example.backend.domain.direccion.Direccion
import com.example.backend.domain.pedido.Pedido
import com.example.backend.domain.review.Review
import com.example.backend.domain.rol.Rol
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import java.time.LocalDate

@Entity
@Table(name = "usuarios")
data class Usuario(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    @NotBlank(message = "El nombre de usuario no puede estar vacío")
    var username: String,

    @Column(nullable = false, unique = true)
    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Debe ser un formato de email válido")
    var email: String,

    @Column(nullable = false)
    @NotBlank(message = "La contraseña no puede estar vacía")
    var passwordHash: String,

    @Column(nullable = false)
    @NotBlank
    var name: String,

    @Column(nullable = false)
    @NotBlank
    var lastName: String,

    @Column(nullable = true)
    var birthDate: LocalDate? = null,

    @ManyToMany(fetch = FetchType.EAGER, targetEntity = Rol::class)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = [JoinColumn(name = "usuario_id")],
        inverseJoinColumns = [JoinColumn(name = "rol_id")]
    )
    var roles: MutableSet<Rol> = mutableSetOf(),

    @OneToMany(mappedBy = "usuario", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    var images: MutableList<UsuarioImagen> = mutableListOf(),

    @OneToMany(mappedBy = "usuario", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("usuario-direcciones")
    var direcciones: MutableList<Direccion> = mutableListOf(),

    @OneToMany(mappedBy = "usuario", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("usuario-reviews")
    var reviews: MutableList<Review> = mutableListOf(),

    @OneToMany(mappedBy = "usuario", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("usuario-pedidos")
    var pedidos: MutableList<Pedido> = mutableListOf()
) : BaseAuditableEntity()
