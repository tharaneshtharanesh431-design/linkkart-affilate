package com.kart.dto.product;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name cannot exceed 255 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Commission percentage is required")
    @DecimalMin(value = "0.00", message = "Commission rate cannot be negative")
    @DecimalMax(value = "100.00", message = "Commission rate cannot exceed 100%")
    private BigDecimal commissionRate;

    @NotNull(message = "Category is required")
    private Long categoryId;

    @Size(max = 1000, message = "Image URL cannot exceed 1000 characters")
    private String imageUrl;

    @Size(max = 1000, message = "Destination URL cannot exceed 1000 characters")
    private String destinationUrl;

    private String status;
}
