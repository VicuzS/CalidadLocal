package com.unmsm.scorely.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unmsm.scorely.dto.SeccionAlumnoDTO;
import com.unmsm.scorely.repository.AlumnoRepository;
import com.unmsm.scorely.services.SeccionService;

@RestController
@RequestMapping("/api/alumno")
@CrossOrigin(origins = "*")
public class AlumnoController {

    private final AlumnoRepository alumnoRepository;
    private final SeccionService seccionService;

    public AlumnoController(AlumnoRepository alumnoRepository, SeccionService seccionService) {
        this.alumnoRepository = alumnoRepository;
        this.seccionService = seccionService;
    }

    // NUEVO: Obtener id_alumno desde id_persona
    @GetMapping("/alumno-id/{idPersona}")
    public ResponseEntity<Map<String, Object>> obtenerIdProfesor(@PathVariable Integer idPersona) {
        Map<String, Object> response = new HashMap<>();

        return alumnoRepository.findIdAlumnoByIdPersona(idPersona)
                .map(idAlumno -> {
                    response.put("success", true);
                    response.put("idAlumno", idAlumno);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "No se encontró alumno con ese id_persona");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    // GET: Obtener secciones de un alumno por año
    @GetMapping("/secciones/{idAlumno}/anio/{anio}")
    public ResponseEntity<List<SeccionAlumnoDTO>> obtenerSeccionesPorAlumnoYAnio(
            @PathVariable Integer idAlumno,
            @PathVariable Integer anio) {
        List<SeccionAlumnoDTO> secciones = seccionService.obtenerSeccionesPorAlumnoYAnio(idAlumno, anio);
        return ResponseEntity.ok(secciones);
    }
}
