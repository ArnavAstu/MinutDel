package com.minutdel.dto;

import com.minutdel.model.Product;
import java.math.BigDecimal;
import java.util.List;

public class AiMealResponse {

    private String reply;
    private List<Product> recommendedProducts;
    private BigDecimal totalCost;
    private String reasoning;
    private String engineSource;

    public AiMealResponse() {}

    public AiMealResponse(String reply, List<Product> recommendedProducts, BigDecimal totalCost, String reasoning, String engineSource) {
        this.reply = reply;
        this.recommendedProducts = recommendedProducts;
        this.totalCost = totalCost;
        this.reasoning = reasoning;
        this.engineSource = engineSource;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<Product> getRecommendedProducts() {
        return recommendedProducts;
    }

    public void setRecommendedProducts(List<Product> recommendedProducts) {
        this.recommendedProducts = recommendedProducts;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public String getReasoning() {
        return reasoning;
    }

    public void setReasoning(String reasoning) {
        this.reasoning = reasoning;
    }

    public String getEngineSource() {
        return engineSource;
    }

    public void setEngineSource(String engineSource) {
        this.engineSource = engineSource;
    }
}
