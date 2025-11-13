package com.example.backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val tokenProvider: JwtTokenProvider
    // Ya no necesitamos UserDetailsService aquí
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        try {
            val jwt = getJwtFromRequest(request)

            if (!jwt.isNullOrBlank() && tokenProvider.validateToken(jwt)) {
                // Extraer datos directamente del token
                val email = tokenProvider.getEmailFromJWT(jwt)
                val roles = tokenProvider.getRolesFromJWT(jwt)

                // Crear las autoridades
                val authorities = roles.map { SimpleGrantedAuthority(it) }

                // Crear el objeto de autenticación SIN consultar la BD
                // Usamos el email como "principal" y no necesitamos credenciales (contraseña)
                val authentication = UsernamePasswordAuthenticationToken(
                    email, null, authorities
                )

                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        } catch (ex: Exception) {
            // Puedes loggear el error si lo deseas
        }

        filterChain.doFilter(request, response)
    }

    private fun getJwtFromRequest(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7)
        }
        return null
    }
}