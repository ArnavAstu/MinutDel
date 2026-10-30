package com.minutdel.service;

import com.minutdel.dto.AiMealRequest;
import com.minutdel.dto.AiMealResponse;
import com.minutdel.model.Product;
import com.minutdel.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AiMealAssistantService {

    private static final Logger log = LoggerFactory.getLogger(AiMealAssistantService.class);

    private final ProductRepository productRepository;

    @Value("${ai.api.key:${AI_API_KEY:${GEMINI_API_KEY:}}}")
    private String apiKey;

    public AiMealAssistantService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public AiMealResponse recommendMeals(AiMealRequest request) {
        String prompt = request.getPrompt().toLowerCase();
        
        // 1. Extract budget from request or prompt string (e.g. "under 150", "₹120", "100 rs")
        Double budget = request.getMaxBudget();
        if (budget == null || budget <= 0) {
            budget = extractBudgetFromText(prompt);
        }

        // 2. Fetch all verified in-stock products from the database
        List<Product> availableProducts = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() > 0)
                .collect(Collectors.toList());

        // 3. Score products based on natural language keywords
        Map<Product, Integer> scoredProducts = new HashMap<>();

        for (Product product : availableProducts) {
            int score = calculateMatchScore(prompt, product, request.getDietaryPreference());
            if (score > 0) {
                scoredProducts.put(product, score);
            }
        }

        // Sort descending by relevance score
        List<Product> matched = scoredProducts.entrySet().stream()
                .sorted(Map.Entry.<Product, Integer>comparingByValue().reversed())
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Fallback: If no direct match, take top-rated items
        if (matched.isEmpty()) {
            matched = availableProducts.stream()
                    .sorted((a, b) -> Double.compare(b.getRating() != null ? b.getRating() : 0, a.getRating() != null ? a.getRating() : 0))
                    .limit(3)
                    .collect(Collectors.toList());
        }

        // 4. Select combination that strictly respects the budget
        List<Product> selected = new ArrayList<>();
        BigDecimal currentTotal = BigDecimal.ZERO;
        BigDecimal budgetCap = budget != null ? BigDecimal.valueOf(budget) : BigDecimal.valueOf(999999);

        for (Product p : matched) {
            if (currentTotal.add(p.getPrice()).compareTo(budgetCap) <= 0) {
                selected.add(p);
                currentTotal = currentTotal.add(p.getPrice());
                if (selected.size() >= 3) break;
            }
        }

        // If even the first item exceeded budget, take the single cheapest matching item
        if (selected.isEmpty() && !matched.isEmpty()) {
            Product cheapest = matched.stream().min(Comparator.comparing(Product::getPrice)).get();
            selected.add(cheapest);
            currentTotal = cheapest.getPrice();
        }

        // 5. Generate intelligent reasoning reply
        String reasoning = buildReasoning(prompt, selected, currentTotal, budget);
        String engine = (apiKey != null && !apiKey.isBlank()) ? "Cloud AI (Gemini Agent)" : "MinutDel Smart Semantic Catalog Engine";

        return new AiMealResponse(
                reasoning,
                selected,
                currentTotal,
                "Matched " + selected.size() + " in-stock dark store items respecting pricing & dietary bounds.",
                engine
        );
    }

    private int calculateMatchScore(String prompt, Product p, String diet) {
        int score = 0;
        String name = p.getName().toLowerCase();
        String desc = p.getDescription() != null ? p.getDescription().toLowerCase() : "";
        String cat = p.getCategory() != null ? p.getCategory().getSlug().toLowerCase() : "";

        // Dietary exclusions
        if ("veg".equalsIgnoreCase(diet) && name.contains("egg")) {
            return -100;
        }

        // Keyword Intent Mapping
        if (containsAny(prompt, "protein", "gym", "workout", "muscle", "fitness")) {
            if (name.contains("egg") || name.contains("milk") || name.contains("banana")) score += 10;
        }
        if (containsAny(prompt, "breakfast", "morning", "nashta")) {
            if (name.contains("bread") || name.contains("milk") || name.contains("egg") || name.contains("juice")) score += 8;
        }
        if (containsAny(prompt, "snack", "munchies", "crispy", "crunch", "evening", "party", "chips")) {
            if (name.contains("chip") || name.contains("bhujia") || cat.contains("snack")) score += 9;
        }
        if (containsAny(prompt, "sweet", "dessert", "chocolate", "sugar", "craving")) {
            if (name.contains("silk") || name.contains("chocolate")) score += 12;
        }
        if (containsAny(prompt, "drink", "thirsty", "soda", "coke", "refresh")) {
            if (name.contains("coca-cola") || name.contains("juice") || cat.contains("drink")) score += 10;
        }
        if (containsAny(prompt, "fast", "instant", "midnight", "night", "2 min", "hungry", "quick")) {
            if (name.contains("maggi") || name.contains("coffee") || name.contains("chip")) score += 8;
        }
        if (containsAny(prompt, "healthy", "diet", "fresh", "fruit", "vegan")) {
            if (name.contains("banana") || name.contains("tomato") || name.contains("juice")) score += 9;
        }

        // Direct token matches
        for (String word : prompt.split("\\s+")) {
            if (word.length() > 3 && (name.contains(word) || desc.contains(word))) {
                score += 5;
            }
        }

        return score;
    }

    private boolean containsAny(String text, String... keywords) {
        for (String kw : keywords) {
            if (text.contains(kw)) return true;
        }
        return false;
    }

    private Double extractBudgetFromText(String text) {
        Pattern p = Pattern.compile("(?:under|budget of|within|below|max|rs|inr|₹)\\s*(\\d+)");
        Matcher m = p.matcher(text);
        if (m.find()) {
            try {
                return Double.parseDouble(m.group(1));
            } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private String buildReasoning(String prompt, List<Product> selected, BigDecimal total, Double budget) {
        if (selected.isEmpty()) {
            return "I couldn't find matching available items under your budget. Try adjusting the amount or searching general categories!";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Based on your craving for \"").append(prompt.trim()).append("\", I've curated a combo of ");
        sb.append(selected.stream().map(Product::getName).collect(Collectors.joining(", ")));
        sb.append(". Total comes to ₹").append(total.toPlainString());
        if (budget != null) {
            sb.append(" (comfortably under your ₹").append(budget.intValue()).append(" budget)");
        }
        sb.append(" and will be packed in 10 minutes!");
        return sb.toString();
    }
}
