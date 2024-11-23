package org.andy.springend.repo;

import jakarta.persistence.Tuple;
import org.andy.springend.dto.CategoryClassifyDto;
import org.andy.springend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByName(String categoryidName);

    @Query("SELECT  DISTINCT c.name,\n" +
            "                COUNT(cert.id) OVER (PARTITION BY cert.categoryid) AS cert_count\n" +
            "FROM Category c\n" +
            "         LEFT JOIN\n" +
            "     Cert cert\n" +
            "     ON\n" +
            "         c.id = cert.categoryid.id\n" +
            "ORDER BY cert_count DESC")
    List<Tuple> findAllCategoryClassifyDto();
}