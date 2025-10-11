package com.unmsm.scorely.services;

import com.unmsm.scorely.models.Seccion;
import com.unmsm.scorely.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SeccionService {

    private final SeccionRepository seccionRepository;

    public SeccionService(SeccionRepository seccionRepository) {
        this.seccionRepository = seccionRepository;
    }

    // Obtener todas las secciones de un profesor
    public List<Seccion> obtenerSeccionesPorProfesor(Integer idProfesor) {
        return seccionRepository.findByIdProfesor(idProfesor);
    }

    // Obtener secciones de un profesor filtradas por año
    public List<Seccion> obtenerSeccionesPorProfesorYAnio(Integer idProfesor, Integer anio) {
        return seccionRepository.findByIdProfesorAndAnio(idProfesor, anio);
    }

    // Crear nueva sección
    @Transactional
    public Seccion crearSeccion(Seccion seccion) {
        return seccionRepository.save(seccion);
    }

    // Eliminar sección (solo si pertenece al profesor)
    @Transactional
    public boolean eliminarSeccion(Integer idSeccion, Integer idProfesor) {
        // Verificar que la sección pertenece al profesor
        if (!seccionRepository.existsByIdSeccionAndIdProfesor(idSeccion, idProfesor)) {
            return false; // No tiene permiso
        }
        
        // Verificar que la sección existe
        Optional<Seccion> seccion = seccionRepository.findById(idSeccion);
        if (seccion.isEmpty()) {
            return false;
        }
        
        // Eliminar la sección
        seccionRepository.deleteById(idSeccion);
        return true;
    }

    // Obtener una sección por ID
    public Optional<Seccion> obtenerSeccionPorId(Integer idSeccion) {
        return seccionRepository.findById(idSeccion);
    }
}