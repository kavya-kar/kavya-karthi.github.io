function createCountryComparisonChart() {
    d3.csv('../data/country_gdp_population.csv').then(data => {
        // Process data and create visualization
        console.log("Creating country comparison chart", data);
        // Your D3 code for country comparison chart goes here
    });
}