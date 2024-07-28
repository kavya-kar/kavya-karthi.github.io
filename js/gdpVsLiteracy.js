function createGdpVsLiteracyChart() {
    d3.csv('../data/country_gdp_population.csv').then(data => {
        // Process data and create visualization
        console.log("Creating GDP vs literacy chart", data);
        // Your D3 code for GDP vs literacy scatter plot goes here
    });
}