package com.promptx.backend;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // CORS configuration to allow requests from any origin
public class PromptController {

    private final EnhanceService enhanceService;

    // Dependency Injection
    public PromptController(EnhanceService enhanceService) {
        this.enhanceService = enhanceService;
    }

    @PostMapping("/enhance")
    public Map<String, String> enhancePrompt(@RequestBody Map<String, String> request) {
        // Extract the prompt from the incoming JSON payload
        String rawPrompt = request.getOrDefault("prompt", "");
        
        // Pass it to the service layer
        String enhancedResult = enhanceService.process(rawPrompt);
        
        // Return as a JSON object
        return Map.of("enhancedPrompt", enhancedResult);
    }
}