let currentSlide = 0;
const totalSlides = 3;

const slides = [
    { title: 'World Literacy Rate Over Time', create: createWorldLiteracyChart },
    // { title: 'Literacy Rates by Country Over Time', create: createCountryComparisonChart },
    { title: 'GDP Vs. Literacy in 2022', create: createGdpVsLiteracyChart },
];

function initializeVisualization() {
    document.getElementById('bs').style.display = 'none';
    document.getElementById('prevBtn').style.visibility = 'visible';
    document.getElementById('nextBtn').style.visibility = 'visible';
    
    showSlide(0);
}

function showSlide(index) {
    console.log("showSlide init: " + currentSlide)
    currentSlide = index;
    
    d3.select("#visualization-container").select("svg").remove(); // Remove the previous chart
    
    document.getElementById("country-select-container").style.visibility = 
        (currentSlide === 1) ? 'visible' : 'hidden';
        
    document.getElementById('text').innerHTML = `<h2>${slides[currentSlide].title}</h2>`;
    slides[currentSlide].create();
    
    updateButtonStates();
    console.log("showSlide end: " + currentSlide)
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



function attachEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', previousScene);
    document.getElementById('nextBtn').addEventListener('click', nextScene);
    document.getElementById('bs').addEventListener('click', initializeVisualization);     
}

// Attach event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', attachEventListeners);

// let currentSlide = 0;
// const totalSlides = 3;

// const slides = [
//     { title: 'World Literacy Rate Over Time', create: createWorldLiteracyChart },
//     { title: 'Literacy Rates by Country Over Time', create: createCountryComparisonChart },
//     { title: 'GDP per Capita by Country', create: createGdpVsLiteracyChart },
// ];

// function initializeVisualization() {
//     document.getElementById('bs').style.display = 'none';
//     document.getElementById('prevBtn').style.visibility = 'visible';
//     document.getElementById('nextBtn').style.visibility = 'visible';
    
//     console.log("curr: " + currentSlide);
//     currentSlide = 0;
//     showSlide(0);
// }

// function showSlide(index) {
//     currentSlide = index;
//     document.getElementById('text').innerHTML = `<h2>${slides[currentSlide].title}</h2>`;
//     document.getElementById('visualization').innerHTML = '';
//     slides[currentSlide].create();
    
//     updateButtonStates();
// }

// function updateButtonStates() {
//     if (currentSlide == 0 ) {
//         document.getElementById('prevBtn').disabled = true;
//     } else {
//         document.getElementById('prevBtn').disabled = false;
//     }
//     if (currentSlide === totalSlides - 1) {
//         document.getElementById('nextBtn').disabled = true;
//     } else {
//         document.getElementById('nextBtn').disabled = false;
//     }
// }

// function previousScene() {
//     if (currentSlide > 0) {
//         console.log("prev scene called")
//         console.log("prev scene: " + currentSlide);
//         showSlide(currentSlide - 1);
//     }
// }

// function nextScene() {
//     if (currentSlide < totalSlides - 1) {
//         console.log("next scene called")
//         console.log("next scene: " + currentSlide);
//         showSlide(currentSlide + 1);
//     }
// }

// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('prevBtn').addEventListener('click', previousScene);
//     document.getElementById('nextBtn').addEventListener('click', nextScene);
//     //document.getElementById('bs').addEventListener('click', initializeVisualization);
// });