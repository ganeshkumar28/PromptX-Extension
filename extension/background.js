console.log("PromptX Background Service Worker Running");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is our specific trigger
    if (request.action === "enhancePrompt") {
        
        // 1. Call the Spring Boot backend
        fetch('http://localhost:8080/api/enhance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: request.text })
        })
        .then(response => response.json())
        .then(data => {
            // 2. Send the enhanced text back to the content script
            sendResponse({ success: true, enhancedText: data.enhancedPrompt });
        })
        .catch(error => {
            console.error("PromptX Fetch Error:", error);
            sendResponse({ success: false, error: error.message });
        });

        // 3. Return true to indicate we wish to send a response asynchronously
        return true; 
    }
});