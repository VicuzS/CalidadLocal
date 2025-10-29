package com.unmsm.scorely.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearTareaRequest {
    private Integer idSeccion;
    private String nombre;
    private String tipo;
    private String descripcion;
    private LocalDateTime fechaVencimiento;
}