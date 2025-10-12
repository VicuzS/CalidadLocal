package com.unmsm.scorely.services.imp;

import com.unmsm.scorely.models.Invitacion;
import com.unmsm.scorely.services.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {
    @Override
    public void enviarInvitacion(Invitacion invitacion) {

    }
}
