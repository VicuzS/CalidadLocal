package com.unmsm.scorely.respitory;

import com.unmsm.scorely.models.Invitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvitacionRepository extends JpaRepository<Invitacion, Integer> {
    Optional<Invitacion> findByCodigo(String codigo);
}
