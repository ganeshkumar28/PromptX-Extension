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

    // Click listener to read the text
    sparkBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent accidental form submission
        
        // ChatGPT uses a rich text editor in newer versions, so innerText is safer
        const currentText = textArea.innerText || textArea.value; 
        console.log("PromptX captured:", currentText);
        
        // Visual feedback for Step 1
        sparkBtn.innerText = 'Loading...';
        setTimeout(() => sparkBtn.innerText = '✨ Spark', 1000); 
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