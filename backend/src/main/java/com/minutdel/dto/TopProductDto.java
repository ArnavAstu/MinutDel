package com.minutdel.dto;

import java.math.BigDecimal;

public class TopProductDto {
    private Long productId;
    private String productName;
    private Long totalQuantitySold;
    private BigDecimal totalRevenueGenerated;

    public TopProductDto() {}

    public TopProductDto(Long productId, String productName, Long totalQuantitySold, BigDecimal totalRevenueGenerated) {
        this.productId = productId;
        this.productName = productName;
        this.totalQuantitySold = totalQuantitySold;
        this.totalRevenueGenerated = totalRevenueGenerated;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getTotalQuantitySold() { return totalQuantitySold; }
    public void setTotalQuantitySold(Long totalQuantitySold) { this.totalQuantitySold = totalQuantitySold; }

    public BigDecimal getTotalRevenueGenerated() { return totalRevenueGenerated; }
    public void setTotalRevenueGenerated(BigDecimal totalRevenueGenerated) { this.totalRevenueGenerated = totalRevenueGenerated; }
}
