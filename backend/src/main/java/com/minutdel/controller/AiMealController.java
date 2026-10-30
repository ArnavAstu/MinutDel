package com.minutdel.controller;

import com.minutdel.dto.AiMealRequest;
import com.minutdel.dto.AiMealResponse;
import com.minutdel.service.AiMealAssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiMealController {

    private final AiMealAssistantService aiMealAssistantService;

    public AiMealController(AiMealAssistantService aiMealAssistantService) {
        this.aiMealAssistantService = aiMealAssistantService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<AiMealResponse> getRecommendations(@Valid @RequestBody AiMealRequest request) {
        AiMealResponse response = aiMealAssistantService.recommendMeals(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getPromptSuggestions() {
        return ResponseEntity.ok(List.of(
                "High protein breakfast under ₹150",
                "Late night spicy study munchies under ₹100",
                "Sweet chocolate craving for 2 people",
                "Healthy fruits and juice combo for workout",
                "Quick 2-minute snack meal with noodles"
        ));
    }
}
