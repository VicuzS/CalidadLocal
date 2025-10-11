package com.unmsm.scorely.services.imp;

import com.unmsm.scorely.models.Invitacion;
import com.unmsm.scorely.respitory.InvitacionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class InvitacionServiceWa {

    private final EmailServiceWA emailService;
    private final InvitacionRepository invitacionRepo;

    @Value("${backend.url}")
    private String backendUrl;

    public InvitacionServiceWa(EmailServiceWA emailService, InvitacionRepository invitacionRepo) {
        this.emailService = emailService;
        this.invitacionRepo = invitacionRepo;
    }

    public void crearYEnviarInvitacion(String correo, String nombre, String curso) {
        // Generar token único
        String token = UUID.randomUUID().toString();
        Invitacion invitacion = new Invitacion();
        invitacion.setCorreo(correo);
        invitacion.setEstado("pendiente");
        invitacion.setCodigo(token);
        invitacionRepo.save(invitacion);


        // Construir enlace que apunta al backend (aceptar invitación)
        String enlace = backendUrl + "/invitaciones/aceptar?token=" + token;

        try {
            emailService.enviarCorreo(correo, nombre, curso, enlace);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar invitación", e);
        }
    }

    public boolean aceptarInvitacion(String token) {
        // Aquí deberías validar el token en tu tabla de invitaciones
        // invitacionRepository.findByToken(token) y cambiar su estado a "aceptado"

        // Simulación por ahora:
        return token != null && !token.isBlank();
    }

    public boolean unirAlumnoAlCurso(String token, String usuario){
        //Implementacion en la base de datos
    }
}
