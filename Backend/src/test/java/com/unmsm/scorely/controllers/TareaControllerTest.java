package com.unmsm.scorely.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unmsm.scorely.dto.CrearTareaRequest;
import com.unmsm.scorely.models.Seccion;
import com.unmsm.scorely.models.Tarea;
import com.unmsm.scorely.services.TareaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TareaController.class)
class TareaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TareaService tareaService;

    private CrearTareaRequest request;
    private Tarea tarea;

    @BeforeEach
    void setUp() {
        request = new CrearTareaRequest();
        request.setIdSeccion(1);
        request.setNombre("Tarea Test");
        request.setTipo("Individual");
        request.setDescripcion("Descripción test");
        request.setFechaVencimiento(LocalDateTime.now().plusDays(7));

        Seccion seccion = new Seccion();
        seccion.setIdSeccion(1);
        seccion.setNombreCurso("Calidad de Software");

        tarea = new Tarea();
        tarea.setIdTarea(1);
        tarea.setNombre("Tarea Test");
        tarea.setTipo("Individual");
        tarea.setDescripcion("Descripción test");
        tarea.setSeccion(seccion);
        tarea.setFechaCreacion(LocalDateTime.now());
    }

    @Test
    @DisplayName("POST /api/tareas - Crear tarea exitosamente")
    void testCrearTarea_Exitoso() throws Exception {
        // Arrange
        when(tareaService.crearTarea(any(CrearTareaRequest.class))).thenReturn(tarea);

        // Act & Assert
        mockMvc.perform(post("/api/tareas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.idTarea").value(1))
                .andExpect(jsonPath("$.nombre").value("Tarea Test"))
                .andExpect(jsonPath("$.tipo").value("Individual"));

        verify(tareaService, times(1)).crearTarea(any(CrearTareaRequest.class));
    }

    @Test
    @DisplayName("POST /api/tareas - Error al crear tarea (servicio retorna null)")
    void testCrearTarea_Error() throws Exception {
        // Arrange
        when(tareaService.crearTarea(any(CrearTareaRequest.class))).thenReturn(null);

        // Act & Assert
        mockMvc.perform(post("/api/tareas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());

        verify(tareaService, times(1)).crearTarea(any(CrearTareaRequest.class));
    }

    @Test
    @DisplayName("GET /api/tareas/seccion/{idSeccion} - Listar tareas")
    void testListarTareasPorSeccion() throws Exception {
        // Arrange
        when(tareaService.listarPorSeccion(1)).thenReturn(Arrays.asList(tarea));

        // Act & Assert
        mockMvc.perform(get("/api/tareas/seccion/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.tareas").isArray())
                .andExpect(jsonPath("$.tareas[0].nombre").value("Tarea Test"));

        verify(tareaService, times(1)).listarPorSeccion(1);
    }

    @Test
    @DisplayName("GET /api/tareas/seccion/{idSeccion} - Sin tareas")
    void testListarTareasPorSeccion_Vacio() throws Exception {
        // Arrange
        when(tareaService.listarPorSeccion(1)).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/tareas/seccion/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.tareas").isEmpty());

        verify(tareaService, times(1)).listarPorSeccion(1);
    }

    @Test
    @DisplayName("GET /api/tareas/{idTarea} - Obtener tarea por ID")
    void testObtenerTareaPorId() throws Exception {
        // Arrange
        when(tareaService.obtenerPorId(1)).thenReturn(tarea);

        // Act & Assert
        mockMvc.perform(get("/api/tareas/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.tarea.idTarea").value(1))
                .andExpect(jsonPath("$.tarea.nombre").value("Tarea Test"));

        verify(tareaService, times(1)).obtenerPorId(1);
    }

    @Test
    @DisplayName("GET /api/tareas/{idTarea} - Tarea no encontrada")
    void testObtenerTareaPorId_NoEncontrada() throws Exception {
        // Arrange
        when(tareaService.obtenerPorId(999)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/tareas/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));

        verify(tareaService, times(1)).obtenerPorId(999);
    }

    @Test
    @DisplayName("PUT /api/tareas/{idTarea} - Actualizar tarea exitosamente")
    void testActualizarTarea_Exitoso() throws Exception {
        // Arrange
        when(tareaService.actualizarTarea(eq(1), any(CrearTareaRequest.class))).thenReturn(tarea);

        // Act & Assert
        mockMvc.perform(put("/api/tareas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Tarea actualizada exitosamente"));

        verify(tareaService, times(1)).actualizarTarea(eq(1), any(CrearTareaRequest.class));
    }

    @Test
    @DisplayName("DELETE /api/tareas/{idTarea} - Eliminar tarea exitosamente")
    void testEliminarTarea_Exitoso() throws Exception {
        // Arrange
        when(tareaService.eliminarTarea(1)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/tareas/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Tarea eliminada exitosamente"));

        verify(tareaService, times(1)).eliminarTarea(1);
    }

    @Test
    @DisplayName("DELETE /api/tareas/{idTarea} - Tarea no existe")
    void testEliminarTarea_NoExiste() throws Exception {
        // Arrange
        when(tareaService.eliminarTarea(999)).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/tareas/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));

        verify(tareaService, times(1)).eliminarTarea(999);
    }
}
