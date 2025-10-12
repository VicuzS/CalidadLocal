package com.unmsm.scorely.services.imp;

import com.unmsm.scorely.models.Alumno;
import com.unmsm.scorely.models.Seccion;
import com.unmsm.scorely.services.MatriculaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MatriculaServiceImpl implements MatriculaService {
    @Override
    public boolean estaMatriculado(Alumno alumno, Seccion seccion) {
        return false;
    }

    @Override
    public void matricularAlumno(Alumno alumno, Seccion seccion) {

    }
}
