function createCountryComparisonChart() {
    const container = d3.select("#visualization");

    d3.csv("./data/cross-country-literacy-rates.csv").then(function(literacyData) {
        const nestedData = d3.group(literacyData, d => d.Code);

        const margin = {top: 20, right: 100, bottom: 50, left: 100},
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = container
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLog().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        const xAxis = svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`);

        const yAxis = svg.append("g")
            .attr("class", "y-axis");

        const line = d3.line()
            .x(d => x(+d.Year))
            .y(d => y(+d["Historical and more recent literacy estimates"]))
            .defined(d => d["Historical and more recent literacy estimates"] !== "");

        const lineGroups = svg.append("g").attr("class", "lines");
        const labelGroups = svg.append("g").attr("class", "labels");
        const dotGroups = svg.append("g").attr("class", "dots");

        nestedData.forEach((values, code) => {
            lineGroups.append("path")
                .datum(values)
                .attr("class", `line ${code}`)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1.5)
                .style("display", "none");

            const lastDataPoint = values[values.length - 1];
            if (lastDataPoint["Historical and more recent literacy estimates"] !== "") {
                labelGroups.append("text")
                    .attr("class", `label ${code}`)
                    .text(code)
                    .attr("font-size", "8px")
                    .attr("alignment-baseline", "middle")
                    .style("display", "none");
            }
        });

        const checkboxContainer = d3.select("#country-checkboxes");
        const countries = Array.from(nestedData.keys());
        
        countries.forEach(country => {
            const label = checkboxContainer.append("label")
                .attr("class", "country-checkbox");
            
            label.append("input")
                .attr("type", "checkbox")
                .attr("value", country)
                .attr("id", `checkbox-${country}`);
            
            label.append("span")
                .text(country);
        });

        function updateGraph() {
            const selectedCountries = countries.filter(country => 
                d3.select(`#checkbox-${country}`).property("checked")
            );
            
            const selectedData = selectedCountries.flatMap(code => nestedData.get(code));
        
            x.domain([
                d3.min(selectedData, d => +d.Year),
                d3.max(selectedData, d => +d.Year)
            ]);
            y.domain([
                0,
                d3.max(selectedData, d => +d["Historical and more recent literacy estimates"])
            ]);
        
            // Update axes
            xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(d3.format("d")));
            yAxis.transition().duration(1000).call(d3.axisLeft(y));
        
            // Update lines
            lineGroups.selectAll(".line")
                .style("display", d => selectedCountries.includes(d[0].Code) ? null : "none")
                .transition()
                .duration(1000)
                .attr("d", line);
        
            labelGroups.selectAll(".label").remove();
            dotGroups.selectAll("circle").remove();
        
            selectedCountries.forEach(code => {
                const countryData = nestedData.get(code);
                const lastDataPoint = countryData[countryData.length - 1];
                
                labelGroups.append("text")
                    .attr("class", `label ${code}`)
                    .text(code)
                    .attr("x", x(+lastDataPoint.Year) + 5)
                    .attr("y", y(+lastDataPoint["Historical and more recent literacy estimates"]))
                    .attr("font-size", "8px")
                    .attr("alignment-baseline", "middle")
                    .style("display", null);

                dotGroups.selectAll(`.dot.${code}`)
                    .data(countryData)
                    .enter()
                    .append("circle")
                    .attr("class", `dot ${code}`)
                    .attr("cx", d => x(+d.Year))
                    .attr("cy", d => y(+d["Historical and more recent literacy estimates"]))
                    .attr("r", 3)
                    .attr("fill", "black");
            });
        }

        checkboxContainer.selectAll("input")
            .on("change", updateGraph);

        svg.append("text")
            .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
            .style("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Literacy Rate (%)");

        const verticalLine = svg.append("line")
            .attr("class", "vertical-line")
            .style("stroke", "gray")
            .style("stroke-width", 1)
            .style("opacity", 0)
            .attr("y1", 0)
            .attr("y2", height);

        const tooltip = d3.select("#chart-container")
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
                
                const selectedCountries = countries.filter(country => 
                    d3.select(`#checkbox-${country}`).property("checked")
                );

                const dataPoints = selectedCountries
                    .map(code => nestedData.get(code).find(d => +d.Year === year))
                    .filter(d => d && d["Historical and more recent literacy estimates"] !== "");

                if (dataPoints.length > 0) {
                    verticalLine
                        .attr("x1", x(year))
                        .attr("x2", x(year))
                        .attr("y1", 0)
                        .attr("y2", height)
                        .style("opacity", 1);

                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(dataPoints.map(d => 
                        `Country: ${d.Entity}<br/>Year: ${d.Year}<br/>Literacy Rate: ${d["Historical and more recent literacy estimates"]}%`
                    ).join("<br/><br/>"))
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                } else {
                    verticalLine.style("opacity", 0);
                    tooltip.style("opacity", 0);
                }
            })
            .on("mouseout", function() {
                verticalLine.style("opacity", 0);
                tooltip.transition().duration(500).style("opacity", 0);
            });

        updateGraph();
    }).catch(function(error) {
        console.log("Error loading the data: " + error);
    });
}
