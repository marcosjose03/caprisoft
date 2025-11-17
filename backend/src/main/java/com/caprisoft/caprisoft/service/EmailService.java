package com.caprisoft.caprisoft.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Recuperación de Contraseña - CAPRISOFT");
        message.setText(
            "Hola,\n\n" +
            "Recibimos una solicitud para restablecer tu contraseña.\n\n" +
            "Haz clic en el siguiente enlace para crear una nueva contraseña:\n" +
            resetLink + "\n\n" +
            "Este enlace expirará en 1 hora.\n\n" +
            "Si no solicitaste este cambio, puedes ignorar este correo.\n\n" +
            "Saludos,\n" +
            "Equipo CAPRISOFT"
        );

        mailSender.send(message);
    }
}