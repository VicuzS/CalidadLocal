package com.unmsm.scorely.controllers;

import com.unmsm.scorely.dto.CorreoRequest;
import com.unmsm.scorely.services.imp.EmailServiceWA;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/correo")
public class EmailController {
    @Autowired
    private EmailServiceWA emailService;



    @PostMapping("/enviar")
    public ResponseEntity<String> enviarCorreo(@RequestBody CorreoRequest request) throws MessagingException{
        emailService.enviarCorreo(
                request.getPara(),
                request.getNombre(),
                request.getCurso(),
                request.getEnlace()
        );
        return ResponseEntity.ok("Correo enviado con éxito bro");
    }
}
