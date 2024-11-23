package org.andy.springend.repo;

import org.andy.springend.entities.Cert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CertRepository extends JpaRepository<Cert, String> {

    @Query("SELECT c FROM Cert c")
    Page<Cert> findAllWithPagination(Pageable pageable);
}