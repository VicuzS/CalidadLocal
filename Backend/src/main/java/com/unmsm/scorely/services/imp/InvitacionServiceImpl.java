package com.unmsm.scorely.services.imp;

import org.springframework.stereotype.Service;

import com.unmsm.scorely.dto.AceptarInvitacionResponse;
import com.unmsm.scorely.dto.InvitacionRequest;
import com.unmsm.scorely.dto.InvitacionResponse;
import com.unmsm.scorely.repository.AlumnoRepository;
import com.unmsm.scorely.repository.InvitacionRepository;
import com.unmsm.scorely.repository.SeccionRepository;
import com.unmsm.scorely.services.EmailService;
import com.unmsm.scorely.services.InvitacionService;
import com.unmsm.scorely.services.InvitacionValidator;
import com.unmsm.scorely.services.MatriculaService;
import com.unmsm.scorely.services.TokenGenerator;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j // Para los log.info(), log.error(), log.debug()
public class InvitacionServiceImpl implements InvitacionService {

    private final InvitacionRepository invitacionRepository;
    private final SeccionRepository seccionRepository;
    private final AlumnoRepository alumnoRepository;
    private final TokenGenerator tokenGenerator;
    private final EmailService emailService;
    private final InvitacionValidator invitacionValidator;
    private final MatriculaService matriculaService;

    public InvitacionServiceImpl(
            InvitacionRepository invitacionRepository,
            SeccionRepository seccionRepository,
            AlumnoRepository alumnoRepository,
            TokenGenerator tokenGenerator,
            EmailService emailService,
            InvitacionValidator invitacionValidator,
            MatriculaService matriculaService
    ) {
        this.invitacionRepository = invitacionRepository;
        this.seccionRepository = seccionRepository;
        this.alumnoRepository = alumnoRepository;
        this.tokenGenerator = tokenGenerator;
        this.emailService = emailService;
        this.invitacionValidator = invitacionValidator;
        this.matriculaService = matriculaService;
    }

    @Override
    public InvitacionResponse crearInvitacion(InvitacionRequest request, Integer idProfesor) {
        return null;
    }

    @Override
    public AceptarInvitacionResponse aceptarInvitacion(String token, Integer idAlumno) {
        return null;
    }

    @Override
    public InvitacionResponse obtenerInvitacionPorToken(String token) {
        return null;
    }
}
