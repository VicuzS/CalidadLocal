package com.unmsm.scorely.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Seccion")
@Data
public class Seccion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seccion")
    private Integer idSeccion;
    
    @Column(name = "id_profesor", nullable = false)
    private Integer idProfesor;
    
    @Column(name = "nombre_curso", nullable = false, length = 40)
    private String nombreCurso;
    
    @Column(name = "anio", nullable = false)
    private Integer anio;
    
    @Column(name = "codigo")
    private Integer codigo;
}
