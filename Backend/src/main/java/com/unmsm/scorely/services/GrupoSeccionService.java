package com.unmsm.scorely.services;

import com.unmsm.scorely.dto.GrupoSeccionDTO;
import com.unmsm.scorely.models.Grupo;
import com.unmsm.scorely.repository.GrupoRepository;
import com.unmsm.scorely.repository.SeccionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GrupoSeccionService {

    private final GrupoRepository grupoRepository;
    private final SeccionRepository seccionRepository;

    public GrupoSeccionService(
            GrupoRepository grupoRepository,
            SeccionRepository seccionRepository
    ) {
        this.grupoRepository = grupoRepository;
        this.seccionRepository = seccionRepository;
    }

    @Transactional(readOnly = true)
    public List<GrupoSeccionDTO> obtenerGruposPorSeccion(Integer idSeccion) {
        // Verificar que la sección existe
        seccionRepository.findById(idSeccion)
            .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        
        List<Grupo> grupos = grupoRepository.findGruposBySeccion(idSeccion);

        return grupos.stream()
                .map(grupo -> convertirADTO(grupo, idSeccion))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GrupoSeccionDTO obtenerGrupoEnSeccion(Integer idSeccion, Integer idGrupo) {
        Grupo grupo = grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        return convertirADTO(grupo, idSeccion);
    }

    private GrupoSeccionDTO convertirADTO(Grupo grupo, Integer idSeccion) {
        // Contar integrantes del grupo en esta sección
        Long cantidadIntegrantes = grupoRepository
                .contarIntegrantesPorGrupoYSeccion(grupo.getIdGrupo(), idSeccion);
        
        return GrupoSeccionDTO.builder()
                .idGrupo(grupo.getIdGrupo())
                .nombreGrupo(grupo.getNombreGrupo())
                .promedioFinal(grupo.getPromedioFinal() != null 
                    ? java.math.BigDecimal.valueOf(grupo.getPromedioFinal()) 
                    : null)
                .cantidadIntegrantes(cantidadIntegrantes.intValue())
                .idSeccion(idSeccion)
                .build();
    }
}