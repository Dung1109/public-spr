package org.andy.springend.service;

import org.andy.springend.dto.CertDto;
import org.andy.springend.entities.Cert;
import org.andy.springend.repo.CategoryRepository;
import org.andy.springend.repo.CertRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CertService {

    private final CertRepository certRepository;
    private final CategoryRepository categoryRepository;

    public CertService(CertRepository certRepository, CategoryRepository categoryRepository) {
        this.certRepository = certRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Cert> getAllCerts() {
        return certRepository.findAll();
    }

    public Cert createCert(CertDto cert) {
        Cert newCert = new Cert();
        newCert.setId(cert.getId());
        newCert.setCertName(cert.getCertName());
        newCert.setCost(cert.getCost());
        newCert.setCategoryid(categoryRepository.findByName(cert.getCategoryidName()));
        return certRepository.save(newCert);
    }

    public boolean deleteCert(String id) {
        certRepository.deleteById(id);
        return true;
    }

    public Map<String, Object> getAllCertsPaging(int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Cert> pageResult = certRepository.findAllWithPagination(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("certs", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());
        return response;

    }
}
