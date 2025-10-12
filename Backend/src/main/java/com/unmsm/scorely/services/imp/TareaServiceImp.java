package com.unmsm.scorely.services.imp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.unmsm.scorely.dto.CrearTareaRequest;
import com.unmsm.scorely.models.Tarea;
import com.unmsm.scorely.repository.TareaRepository;
import com.unmsm.scorely.services.TareaService;

@Service
public class TareaServiceImp implements TareaService {

    private final TareaRepository tareaRepository;

    public TareaServiceImp(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @Override
    @Transactional
    public Tarea crearTarea(CrearTareaRequest req) {
        try {
            Tarea tarea = new Tarea();
            tarea.setNombre(req.getNombre());
            tarea.setTipo(req.getTipo());
            tarea.setDescripcion(req.getDescripcion());
            tarea.setFechaVencimiento(req.getFechaVencimiento());
            tarea.setFechaCreacion(LocalDateTime.now());

            return tareaRepository.save(tarea);
        } catch (Exception e) {
            System.err.println("Error al crear tarea: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<Tarea> listarPorSeccion(Integer idSeccion) {
        try {
            List<Tarea> tareas = tareaRepository.findByIdSeccion(idSeccion);
            return tareas != null ? tareas : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error al listar tareas: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    public Tarea obtenerPorId(Integer idTarea) {
        try {
            return tareaRepository.findById(idTarea).orElse(null);
        } catch (Exception e) {
            System.err.println("Error al obtener tarea: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    @Transactional
    public boolean eliminarTarea(Integer idTarea) {
        try {
            if (!tareaRepository.existsById(idTarea)) {
                return false;
            }
            tareaRepository.deleteById(idTarea);
            return true;
        } catch (Exception e) {
            System.err.println("Error al eliminar tarea: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public Tarea actualizarTarea(Integer idTarea, CrearTareaRequest req) {
        try {
            Tarea tarea = tareaRepository.findById(idTarea).orElse(null);
            if (tarea == null) {
                return null;
            }

            tarea.setNombre(req.getNombre());
            tarea.setTipo(req.getTipo());
            tarea.setDescripcion(req.getDescripcion());
            tarea.setFechaVencimiento(req.getFechaVencimiento());

            return tareaRepository.save(tarea);
        } catch (Exception e) {
            System.err.println("Error al actualizar tarea: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
