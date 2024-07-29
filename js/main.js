let currentSlide = 0;
const totalSlides = 3;

const slides = [
    { title: 'World Literacy Rate Over Time', create: createWorldLiteracyChart },
    { title: 'Literacy Rates by Country Over Time', create: createCountryComparisonChart },
    { title: 'GDP Vs. Literacy in 2022', create: createGdpVsLiteracyChart },
];

function initializeVisualization() {
    document.getElementById('bs').style.display = 'none';
    document.getElementById('prevBtn').style.visibility = 'visible';
    document.getElementById('nextBtn').style.visibility = 'visible';
    
    showSlide(0);
}

function showSlide(index) {
    cleanupCurrentSlide();
    
    document.getElementById("country-select-container").style.visibility = 
        (index === 1) ? 'visible' : 'hidden';
    document.getElementById('text').innerHTML = `<h2>${slides[index].title}</h2>`;
    slides[index].create();
    
    updateButtonStates();
    console.log("showSlide end: " + index)
}

function showSlide2(index) {
    cleanupCurrentSlide();
    
    document.getElementById("country-select-container").style.visibility = 
        (index === 1) ? 'visible' : 'hidden';
    document.getElementById('text').innerHTML = `<h2>${slides[index].title}</h2>`;
    slides[index].create();
    
    updateButtonStates();
    currentSlide = index;
    console.log("showSlide end: " + index)
}

function updateButtonStates() {
    document.getElementById('prevBtn').disabled = (currentSlide === 0);
    document.getElementById('nextBtn').disabled = (currentSlide === totalSlides - 1);
}

function cleanupCurrentSlide() {
    // Remove any SVGs
    d3.select("#visualization").html("");
    d3.select("#visualization").selectAll("svg").remove();
    
    // Remove any additional elements created by specific slides
    d3.select("#visualization").selectAll("input").remove();
    d3.select("#visualization").selectAll("div.tooltip").remove();
    d3.select("#visualization").selectAll("div").remove();
    // Clear any intervals or timeouts
    // (add this if you have any animations or timeouts in your visualizations)
    clearInterval(window.currentInterval);
    clearTimeout(window.currentTimeout);
}

function previousScene() {
    if (currentSlide > 0) {
    
    //     document.getElementById("country-select-container").style.visibility = 
    //         (currentSlide - 1 === 1) ? 'visible' : 'hidden';
    //     document.getElementById('text').innerHTML = `<h2>${slides[currentSlide - 1].title}</h2>`;
    //     slides[currentSlide - 1].create();
    
    //     updateButtonStates();
        
        showSlide2(currentSlide - 1);
    }
}

function nextScene() {
    if (currentSlide < totalSlides - 1) {
        currentSlide += 1
        showSlide(currentSlide);
    }
}

function attachEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', previousScene);
    document.getElementById('nextBtn').addEventListener('click', nextScene);
    document.getElementById('bs').addEventListener('click', initializeVisualization);     
}

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', attachEventListeners);
