package com.caprisoft.caprisoft.service;

import com.caprisoft.caprisoft.dto.AuthResponseDTO;
import com.caprisoft.caprisoft.dto.UserLoginDTO;
import com.caprisoft.caprisoft.dto.UserRegisterDTO;
import com.caprisoft.caprisoft.entity.Role;
import com.caprisoft.caprisoft.entity.User;
import com.caprisoft.caprisoft.exception.UserAlreadyExistsException;
import com.caprisoft.caprisoft.repository.UserRepository;
import com.caprisoft.caprisoft.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    public void register(UserRegisterDTO registerDTO) {
        userRepository.findByEmail(registerDTO.getEmail()).ifPresent(user -> {
            throw new UserAlreadyExistsException("El email ya está registrado: " + registerDTO.getEmail());
        });

        User newUser = User.builder()
                .fullName(registerDTO.getFullName())
                .email(registerDTO.getEmail())
                .phone(registerDTO.getPhone())
                .passwordHash(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.CLIENTE) // Por defecto, los nuevos usuarios son CLIENTES
                .isActive(true)
                .build();

        userRepository.save(newUser);
    }

public AuthResponseDTO login(UserLoginDTO loginDTO) {
    try {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getEmail());
        final User user = userRepository.findByEmail(loginDTO.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        final String token = jwtUtil.generateToken(userDetails);

        return AuthResponseDTO.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();

    } catch (AuthenticationException e) {
        throw new org.springframework.web.server.ResponseStatusException(
            org.springframework.http.HttpStatus.UNAUTHORIZED,
            "Credenciales inválidas"
        );
    }
}

}

