package com.promptx.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;
import java.util.List;

@Service
public class EnhanceService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String process(String rawPrompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        String systemInstructionText = 
            "You are an Expert AI Prompt Engineer. Your task is to transform the user's brief input into a highly detailed, optimized prompt.\n" +
            "Step 1: Analyze the user's core intent (e.g., coding, creative writing, business analysis, financial analysis, fitness planning, study roadmap planning...etc).\n" +
            "Step 2: Expand their input into a comprehensive prompt. Assign a highly relevant expert persona, define clear constraints, provide context, and specify the output format.\n" +
            "CRITICAL CONSTRAINT: You must output ONLY the final enhanced prompt. Absolutely NO conversational filler, NO introductory phrases (e.g., 'Okay, here is...', 'As a Senior...'), and NO concluding remarks. Start your response directly with the prompt text.";

        // Constructing the JSON payload using Gemini's specific system_instruction structure
        Map<String, Object> requestBody = Map.of(
            "system_instruction", Map.of(
                "parts", Map.of("text", systemInstructionText)
            ),
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", rawPrompt)
                ))
            )
        );

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("candidates")
                       .get(0)
                       .path("content")
                       .path("parts")
                       .get(0)
                       .path("text")
                       .asText()
                       .trim(); // Added .trim() to strip any accidental leading/trailing whitespace

        } catch (Exception e) {
            System.err.println("PromptX API Error: " + e.getMessage());
            return "PromptX Error: Failed to generate enhancement from AI.";
        }
    }
}