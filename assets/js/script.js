document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote');
    const authorText = document.getElementById('author');
    const errorMessage = document.getElementById('error-message');
    const feedbackInput = document.getElementById('feedback');
    const feedbackMessage = document.getElementById('feedback-message');
    const submitFeedbackButton = document.getElementById('submit-feedback');
    const searchInput = document.getElementById('search-input');
    const searchMessage = document.getElementById('search-message');
    const searchButton = document.getElementById('search-button');
    const additionalInfo = document.getElementById('additional-info');
    
    // Function to fetch and display a new quote using Promises
    function fetchQuotePromise() {
        return new Promise((resolve, reject) => {
            fetch('https://api.quotable.io/random?tags=motivational|inspirational')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Display the quote and author
                    displayQuote(data.content, data.author);
                    resolve();
                })
                .catch(error => {
                    handleError(error);
                    reject(error);
                });
        });
    }
    
    // Function to display a quote and author
    function displayQuote(quote, author) {
        quoteText.textContent = quote;
        authorText.innerHTML = `<p><strong>by -- ${author}</strong></p>`; // Use innerHTML to format author text
        errorMessage.textContent = '';
    
        // Dynamically add additional HTML content (removed the link)
        const additionalHTML = `
            <p><strong>Quote Length:</strong> ${quote.length} characters</p>
        `;
        additionalInfo.innerHTML = additionalHTML;
    
        // Style change: Highlight the text based on quote length
        if (quote.length >= 100) {
            quoteText.classList.add('highlight');
        } else {
            quoteText.classList.remove('highlight');
        }
    
        // Changing background color dynamically
        document.body.style.backgroundColor = getRandomColor();
    }
    
    // Error handling function
    function handleError(error) {
        console.error('Error fetching the quote:', error);
        errorMessage.textContent = 'Failed to load quote. Please try again later.';
        quoteText.textContent = '';
        authorText.innerHTML = ''; // Clear author text
    }
    
    // Helper function to get a random color
    function getRandomColor() {
        const colors = ['#f0f8ff', '#faebd7', '#f5f5dc', '#e6e6fa', '#ffe4e1'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Initialize quotes and auto-refresh
    function initializeQuotes() {
        fetchQuotePromise()
            .then(() => {
                // Delay the first auto-refresh by 20 seconds
                setTimeout(() => {
                    setInterval(fetchQuotePromise, 20000);
                }, 20000);
            })
            .catch(error => {
                console.error('Failed to initialize quotes:', error);
            });
    }
    
    // Feedback submission handler
    submitFeedbackButton.addEventListener('click', () => {
        const feedback = feedbackInput.value.trim();
    
        // Basic validation
        if (feedback.length === 0) {
            displayFeedbackMessage('Please enter some feedback.', false);
        } else {
            displayFeedbackMessage('Thank you for your feedback!', true);
    
            // Clear the input field
            feedbackInput.value = '';
        }
    });
    
    // Function to display feedback message
    function displayFeedbackMessage(message, isSuccess) {
        const feedbackHTML = `
            <p class="${isSuccess ? 'success-message' : 'error-message'}">${message}</p>
        `;
        feedbackMessage.innerHTML = feedbackHTML;
    }
    
    // New search functionality to find and display a quote
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
    
        // Basic validation
        if (searchTerm.length === 0) {
            searchMessage.textContent = 'Please enter a search term.';
        } else {
            searchMessage.textContent = ''; // Clear any previous messages
    
            // Fetch quotes containing the search term
            searchQuote(searchTerm);
        }
    });
    
    // Function to search for a quote based on the search term
    function searchQuote(term) {
        fetch(`https://api.quotable.io/search/quotes?query=${term}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.count > 0) {
                    // Display the first matching quote
                    displayQuote(data.results[0].content, data.results[0].author);
                } else {
                    quoteText.textContent = 'No quotes found.';
                    authorText.innerHTML = ''; // Clear author text
                    errorMessage.textContent = '';
                    additionalInfo.innerHTML = ''; // Clear additional info if no quotes found
                }
            })
            .catch(error => {
                handleError(error);
            });
    }
    
    // Call the initialize function
    initializeQuotes();
    });