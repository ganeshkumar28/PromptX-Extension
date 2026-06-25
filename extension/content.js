// Function to inject the Spark button
function injectSparkButton() {
    const textArea = document.querySelector('#prompt-textarea');
    
    // If text area doesn't exist or button is already there, do nothing
    if (!textArea || document.querySelector('.promptx-spark-btn')) {
        return;
    }

    // Find the wrapper element to attach our button to
    const wrapper = textArea.parentElement;
    wrapper.style.position = 'relative'; // Ensure absolute positioning works

    // Create the button
    const sparkBtn = document.createElement('button');
    sparkBtn.innerText = '✨ Spark';
    sparkBtn.className = 'promptx-spark-btn';

    // Click listener to read the text and trigger the backend
    sparkBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        const currentText = textArea.innerText || textArea.value; 
        
        // Visual feedback - lock the button while processing
        sparkBtn.innerText = 'Loading...';
        sparkBtn.disabled = true;
        sparkBtn.style.opacity = '0.7';

        // Send the text to our background service worker
        chrome.runtime.sendMessage(
            { action: "enhancePrompt", text: currentText },
            (response) => {
                // Reset button visuals
                sparkBtn.innerText = '✨ Spark';
                sparkBtn.disabled = false;
                sparkBtn.style.opacity = '1';

                if (response && response.success) {
                    // The React DOM Manipulation Strategy
                    textArea.focus();
                    
                    // Select all existing text and replace it via execCommand
                    // This forces React's internal state to recognize the change   
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, response.enhancedText);
                    
                } else {
                    console.error("PromptX Backend Error:", response?.error);
                    alert("PromptX Error: Could not connect to the backend. Is Spring Boot running?");
                }
            }
        );
    });

    // Inject into DOM
    wrapper.appendChild(sparkBtn);
}

// Set up MutationObserver to handle single-page application navigation
const observer = new MutationObserver(() => {
    injectSparkButton();
});

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial run
injectSparkButton();