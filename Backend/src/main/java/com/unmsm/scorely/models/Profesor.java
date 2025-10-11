package com.unmsm.scorely.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Profesor")
@Data
public class Profesor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_profesor")
    private Integer idProfesor;
    
    @Column(name = "id_persona", nullable = false)
    private Integer idPersona;
}
