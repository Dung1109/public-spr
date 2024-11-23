package org.andy.springend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "cert")
public class Cert {

    @Id
    @Size(max = 12)
    @Column(name = "id", nullable = false, length = 12)
    private String id;

    @Size(max = 255)
    @NotNull
    @Column(name = "cert_name", nullable = false)
    private String certName;

    @NotNull
    @Column(name = "cost", nullable = false, precision = 5, scale = 1)
    private BigDecimal cost;

    @ManyToOne
    @JoinColumn(name = "categoryid")
    private Category categoryid;

}