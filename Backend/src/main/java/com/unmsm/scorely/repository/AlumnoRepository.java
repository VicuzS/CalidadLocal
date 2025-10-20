package com.unmsm.scorely.repository;

import com.unmsm.scorely.models.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {

    @Query("SELECT a FROM Alumno a JOIN a.persona p WHERE p.correo = :correo")
    Optional<Alumno> findByCorreo(@Param("correo") String correo);

    Optional<Alumno> findByCodigoAlumno(String codigoAlumno);
}