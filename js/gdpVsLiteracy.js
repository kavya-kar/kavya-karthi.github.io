function createGdpVsLiteracyChart() {
    const container = d3.select("#visualization");

    Promise.all([
        d3.csv('../data/cross-country-literacy-rates.csv'),
        d3.csv('../data/dictionary.csv')
    ]).then(([literacyData, gdpData]) => {
        const literacy2022 = literacyData.filter(d => d.Year === '2022');

        const mergedData = gdpData.map(gdp => {
            const literacy = literacy2022.find(l => l.Code === gdp.Code);
            return {
                country: gdp.Country,
                code: gdp.Code,
                gdp: +gdp['GDP per Capita'],
                literacy: literacy ? +literacy['Historical and more recent literacy estimates'] : null
            };
        }).filter(d => d.gdp && d.literacy);

        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const xAxis = svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .attr("class", "x-axis");

        const yAxis = svg.append("g")
            .attr("class", "y-axis");

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .text("GDP per Capita");

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -height / 2)
            .text("Literacy Rate (%)");

        const dotsGroup = svg.append("g").attr("class", "dots");

        const tooltip = container
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("position", "absolute");

        function updateChart(gdpThreshold) {
            const filteredData = mergedData.filter(d => d.gdp <= gdpThreshold);

            // Update scales
            x.domain([0, d3.max(filteredData, d => d.gdp)]);
            y.domain([0, 100]);

            // Update axes
            xAxis.transition().duration(1000).call(d3.axisBottom(x));
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            const dots = dotsGroup.selectAll(".dot")
                .data(filteredData, d => d.code);

            dots.enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", 5)
                .attr("fill", "steelblue")
                .merge(dots)
                .transition()
                .duration(1000)
                .attr("cx", d => x(d.gdp))
                .attr("cy", d => y(d.literacy));

            dots.exit().remove();

            svg.selectAll(".dot")
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`Country: ${d.country}<br/>GDP: $${d.gdp.toFixed(2)}<br/>Literacy Rate: ${d.literacy.toFixed(2)}%`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }

        const gdpSlider = container
            .append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", d3.max(mergedData, d => d.gdp))
            .attr("step", 100)
            .attr("value", d3.max(mergedData, d => d.gdp))
            .style("width", "100%");

        const sliderLabel = container
            .append("div")
            .text(`GDP Threshold: ${d3.max(mergedData, d => d.gdp)}`);

        gdpSlider.on("input", function() {
            const gdpThreshold = +this.value;
            sliderLabel.text(`GDP Threshold: $${gdpThreshold.toFixed(2)}`);
            updateChart(gdpThreshold);
        });

        // Initial chart render
        updateChart(d3.max(mergedData, d => d.gdp));
    }).catch(error => {
        console.error("Error loading the data:", error);
    });
}