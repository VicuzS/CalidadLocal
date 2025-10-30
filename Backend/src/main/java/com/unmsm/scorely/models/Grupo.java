package com.unmsm.scorely.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Grupo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grupo")
    private Integer idGrupo;

    @Column(name = "nombre_grupo", length = 20)
    private String nombreGrupo;

    @Column(name = "promedio_final")
    private Integer promedioFinal;
}
