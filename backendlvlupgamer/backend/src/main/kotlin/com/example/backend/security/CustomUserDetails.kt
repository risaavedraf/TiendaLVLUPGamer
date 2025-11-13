package com.example.backend.security

import com.example.backend.domain.usuario.Usuario
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(val usuario: Usuario) : UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return usuario.roles.map { SimpleGrantedAuthority(it.nombre) }
    }

    override fun getPassword(): String = usuario.passwordHash
    override fun getUsername(): String = usuario.email
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
}