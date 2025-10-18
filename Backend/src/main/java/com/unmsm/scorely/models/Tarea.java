package com.unmsm.scorely.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Integer idTarea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_seccion", nullable = false)
    private Seccion seccion;

    @OneToMany(mappedBy = "tarea", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Entrega> entrega;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombreTarea;

    @Column(name = "tipo", nullable = false, length = 10)
    private String tipoTarea;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_vencimiento")
    private LocalDateTime fechaVencimiento;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
}
