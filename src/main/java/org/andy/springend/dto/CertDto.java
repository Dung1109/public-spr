package org.andy.springend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.andy.springend.entities.Cert;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link Cert}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertDto implements Serializable {
    @NotNull
    @Size(max = 12)
    String id;
    @NotNull
    @Size(max = 255)
    String certName;
    @NotNull
    BigDecimal cost;
    String categoryidName;
}