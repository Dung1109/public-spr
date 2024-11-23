package org.andy.springend.repo;

import org.andy.springend.entities.Cert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertRepository extends JpaRepository<Cert, String> {
}