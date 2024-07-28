function createWorldLiteracyChart() {

    const margin = {top: 20, right: 100, bottom: 50, left: 100},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;  

    // d3.select("#visualization svg").remove();

    const svg = d3.select("#visualization")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    d3.csv("../data/cross-country-literacy-rates.csv").then(function(data) {
        const worldData = data
            .filter(d => d.Code === "OWID_WRL")
            .map(d => ({
                year: +d.Year,
                literacy: +d["Historical and more recent literacy estimates"]
            }))
            .sort((a, b) => a.year - b.year);


        worldData.forEach(d => {
            if (isNaN(d.year) || isNaN(d.literacy)) {
                console.error("Invalid data point:", d);
            }
        });

        const x = d3.scaleLog()
            .base(20)
            .domain(d3.extent(worldData, d => d.year))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        const y = d3.scaleLinear()
            .domain([0, d3.max(worldData, d => d.literacy)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Year");

        svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 12)
        .attr("x", -height / 2)
        .text("Literacy Rate (%)");

        svg.append("path")
            .datum(worldData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.literacy))
            );

        const verticalLine = svg.append("line")
            .attr("class", "vertical-line")
            .style("stroke", "gray")
            .style("stroke-width", 1)
            .style("opacity", 0)
            .attr("y1", 0)
            .attr("y2", height);

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

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("opacity", 0)
            .on("mousemove", function(event) {
                const [mouseX] = d3.pointer(event);

                const year = Math.round(x.invert(mouseX));
                const dataPoint = worldData.find(d => d.year === year);

                if (dataPoint) {
                    verticalLine
                        .attr("x1", x(year))
                        .attr("x2", x(year))
                        .style("opacity", 1);

                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`Year: ${dataPoint.year}<br/>Literacy Rate: ${dataPoint.literacy.toFixed(2)}%`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                }
            })
            .on("mouseout", function() {
                verticalLine.style("opacity", 0);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        svg.selectAll("dot")
            .data(worldData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.literacy))
            .attr("r", 2.5)
            .attr("fill", "steelblue");
    }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
    });
}