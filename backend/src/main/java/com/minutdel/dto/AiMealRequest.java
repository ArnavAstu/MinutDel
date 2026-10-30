package com.minutdel.dto;

import jakarta.validation.constraints.NotBlank;

public class AiMealRequest {

    @NotBlank(message = "Prompt cannot be empty")
    private String prompt;

    private Double maxBudget;
    private String dietaryPreference; // "any", "veg", "vegan", "protein"

    public AiMealRequest() {}

    public AiMealRequest(String prompt, Double maxBudget, String dietaryPreference) {
        this.prompt = prompt;
        this.maxBudget = maxBudget;
        this.dietaryPreference = dietaryPreference;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public Double getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(Double maxBudget) {
        this.maxBudget = maxBudget;
    }

    public String getDietaryPreference() {
        return dietaryPreference;
    }

    public void setDietaryPreference(String dietaryPreference) {
        this.dietaryPreference = dietaryPreference;
    }
}
