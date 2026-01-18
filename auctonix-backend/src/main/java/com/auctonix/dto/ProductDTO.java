package com.auctonix.dto;

import com.auctonix.model.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private BigDecimal basePrice;
    private BigDecimal finalPrice;
    private ProductStatus status;
    //seller info
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;

    private String imageUrl;
    private String pdfUrl;

}
