package com.caprisoft.caprisoft.security.jwt;

import com.caprisoft.caprisoft.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    // Lista de endpoints que NO requieren token JWT
    private static final List<String> EXCLUDED_PATHS = Arrays.asList(
            "/api/auth/login",
            "/api/auth/register", 
            "/api/auth/ping",

            // NECESARIO PARA EL FRONTEND ADMIN
            "/api/orders/statuses",
            "/api/orders/payment-methods",
            "/api/integration"
    );

    

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String requestPath = request.getRequestURI();
        
        // CRÍTICO: No aplicar el filtro JWT a endpoints de autenticación
        if (shouldSkipFilter(requestPath)) {
            System.out.println("🟢 SALTANDO JWT FILTER para: " + requestPath);
            filterChain.doFilter(request, response);
            return;

            
        }

        System.out.println("🔍 APLICANDO JWT FILTER para: " + requestPath);

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        // Extraer token del header Authorization
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractUsername(token);
                System.out.println("✅ Email extraído del token: " + email);
            } catch (Exception e) {
                System.out.println("❌ Error extrayendo username del token: " + e.getMessage());
            }
        } else {
            System.out.println("❌ No se encontró header Authorization o no empieza con 'Bearer '");
        }

        // Si tenemos email y no hay autenticación previa
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                // Validar token
                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("✅ Usuario autenticado vía JWT: " + email);
                } else {
                    System.out.println("❌ Token inválido para usuario: " + email);
                }
            } catch (Exception e) {
                System.out.println("❌ Error durante validación JWT: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Determina si el filtro JWT debe ser omitido para esta ruta
     */
    private boolean shouldSkipFilter(String requestPath) {
        return EXCLUDED_PATHS.stream().anyMatch(requestPath::startsWith);
    }
}