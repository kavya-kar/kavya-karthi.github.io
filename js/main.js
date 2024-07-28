let currentSlide = 0;
const totalSlides = 2; // Adjust this number based on your total number of visualizations

const slides = [
    { title: 'World Literacy Rate Over Time', create: createWorldLiteracyChart },
    { title: 'Country Comparison', create: createCountryComparisonChart },
    // Add more slides as needed
];

function initializeVisualization() {
    // Hide the "Explore Literacy Rates" button
    document.getElementById('bs').style.display = 'none';
    
    // Show navigation buttons
    document.getElementById('prevBtn').style.visibility = 'visible';
    document.getElementById('nextBtn').style.visibility = 'visible';
    
    // Show the first slide
    showSlide(0);
}

function showSlide(index) {
    currentSlide = index;
    
    // Update title
    document.getElementById('text').innerHTML = `<h2>${slides[index].title}</h2>`;
    
    // Clear previous visualization
    document.getElementById('chart').innerHTML = '';
    
    // Create new visualization
    slides[index].create();
    
    // Update button states
    updateButtonStates();
}

function updateButtonStates() {
    document.getElementById('prevBtn').disabled = (currentSlide === 0);
    document.getElementById('nextBtn').disabled = (currentSlide === totalSlides - 1);
}

function previousScene() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

function nextScene() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prevBtn').addEventListener('click', previousScene);
    document.getElementById('nextBtn').addEventListener('click', nextScene);
    document.getElementById('bs').addEventListener('click', initializeVisualization);
});