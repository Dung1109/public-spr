package org.andy.springend.controller;


import org.andy.springend.dto.CertDto;
import org.andy.springend.entities.Cert;
import org.andy.springend.service.CertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cert")
public class CertController {

    private final CertService certService;

    public CertController(CertService certService) {
        this.certService = certService;
    }

    @RequestMapping("/test")
    public String test() {
        return "Hello World";
    }

    @GetMapping
    public ResponseEntity<List<Cert>> getAllCerts() {
        return ResponseEntity.ok(certService.getAllCerts());
    }

    @PostMapping
    public ResponseEntity<Cert> createCert(@RequestBody CertDto cert) {
        return ResponseEntity.ok(certService.createCert(cert));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCert(@PathVariable String id) {
        return ResponseEntity.ok(certService.deleteCert(id));
    }

    @GetMapping("/paging")
    public ResponseEntity<Map<String,Object>> getAllCertsPaging(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(certService.getAllCertsPaging(page, size));
    }
}
