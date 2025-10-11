package com.unmsm.scorely.services.imp;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceWA {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void enviarCorreo(String para, String nombreAlumno, String curso, String enlace) throws MessagingException {
        Context context = new Context();
        context.setVariable("nombreAlumno", nombreAlumno);
        context.setVariable("curso", curso);
        context.setVariable("enlace", enlace);

        String contenidoHtml = templateEngine.process("invitacion", context);

        MimeMessage mensaje = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
        helper.setTo(para);
        helper.setSubject("Invitación al curso: " + curso);
        helper.setText(contenidoHtml, true); // True para indicar que es HTML
        helper.setFrom("gerarleonce0703@gmail.com");

        mailSender.send(mensaje);
    }
}
