package com.unmsm.scorely.controllers;

import com.unmsm.scorely.services.InvitacionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.net.URI;

@RestController
@RequestMapping("/invitaciones")
public class InvitacionController {

    private final InvitacionService invitacionService;

    @Value("${frontend.url}")
    private String frontendUrl;

    public InvitacionController(InvitacionService invitacionService) {
        this.invitacionService = invitacionService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<String> enviarInvitacion(
            @RequestParam String correo,
            @RequestParam String nombre,
            @RequestParam String curso) {

        invitacionService.crearYEnviarInvitacion(correo, nombre, curso);
        return ResponseEntity.ok("Invitación enviada correctamente ✅");
    }

    // Endpoint para el alumno que hace clic en el enlace
    @GetMapping("/aceptar")
    public ResponseEntity<Void> aceptarInvitacion(@RequestParam String token) {
        boolean ok = invitacionService.aceptarInvitacion(token);

        // redirige al frontend con estado
        // Será modificar parte del login para ver si está aceptado
        URI destino = URI.create(frontendUrl + "/login?inv=" + (ok ? "ok" : "invalid"));
        return ResponseEntity.status(302).location(destino).build();
    }

    @PostMapping("/unirse")
    public ResponseEntity<String> unirse(@RequestParam String token, @AuthenticationPrincipal String alumno) {
        boolean unido = invitacionService.unirAlumnoAlCurso(token, usuario);
        return unido
                ? ResponseEntity.ok("Alumno unido correctamente al curso ")
                : ResponseEntity.badRequest().body("Token inválido o ya usado ");
    }

}
