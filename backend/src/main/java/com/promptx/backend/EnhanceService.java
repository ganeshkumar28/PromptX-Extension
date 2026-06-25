package com.promptx.backend;

import org.springframework.stereotype.Service;

@Service
public class EnhanceService {

    public String process(String rawPrompt) {
        // Hardcoded "Senior Developer" persona instruction as per the PRD
        String personaInstruction = "Act as a Senior Developer. Write a structured, robust, and documented solution for: ";
        
        // Mocking the LLM generation for now to validate our REST endpoint
        String mockedAiGeneration = "\n\n[MOCKED AI: Included error handling, modular functions, and inline documentation.]";
        
        return personaInstruction + "'" + rawPrompt + "'" + mockedAiGeneration;
    }
}