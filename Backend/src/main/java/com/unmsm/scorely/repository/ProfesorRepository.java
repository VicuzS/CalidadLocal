package com.unmsm.scorely.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfesorRepository extends JpaRepository<Object, Integer> {
    
    @Query(value = "SELECT id_profesor FROM Profesor WHERE id_persona = ?1", nativeQuery = true)
    Optional<Integer> findIdProfesorByIdPersona(Integer idPersona);
}
