function createWorldLiteracyChart() {
    // Set the dimensions and margins of the graph
    const margin = {top: 20, right: 30, bottom: 50, left: 60},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select("#visualization svg").remove();

    // Append the svg object to the visualization div
    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the data
    d3.csv("../data/cross-country-literacy-rates.csv").then(function(data) {
        // Filter and parse the data for the world
        const worldData = data
            .filter(d => d.Country === "World")
            .map(d => ({
                year: +d.Year,
                literacy: +d.Literacy
            }))
            .sort((a, b) => a.year - b.year);

        // X axis
        const x = d3.scaleLinear()
            .domain(d3.extent(worldData, d => d.year))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        // Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(worldData, d => d.literacy)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 40)
            .text("Year");

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top)
            .text("Literacy Rate (%)");

        // Add the line
        svg.append("path")
            .datum(worldData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.literacy))
            );

        // Create a tooltip
        const tooltip = d3.select("#visualization")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("position", "absolute");

        // Add the points
        svg.selectAll("dot")
            .data(worldData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.literacy))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Year: ${d.year}<br/>Literacy Rate: ${d.literacy.toFixed(2)}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });
    });
}