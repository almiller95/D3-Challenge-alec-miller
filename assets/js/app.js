
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // clear svg is not empty
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 40,
    right: 40,
    bottom: 60,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom - margin.top;
  var width = svgWidth - margin.left - margin.right;

  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // reading in the csv data
    d3.csv("assets/data/data.csv").then(data => {
      console.log(data)
    
      // Step 1: Parse Data/Cast as numbers
      // Healthcare vs. Poverty or Smokers vs. Age
      data.forEach(row => {
        row.poverty = +row.poverty
        row.healthcare = +row.healthcare
      })

      // Step 2: Create scale functions

      // xScale (linear for poverty %)
      var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, width]);

      console.log('Poverty Max ' + d3.max(data, d => d.poverty))

      // yScale (linear for healthcare %)
      var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([height, 0]);

      console.log('HealthCare Max ' + d3.max(data, d => d.healthcare))

      // Step 3: Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Step 4: Append Axes to the chart
      
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);
      
      // Step 5: Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".65");
 
      // Step 6: Add circle labels layers | creating a new chart group for just the text objects
      var circleLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(d => (d.abbr))
        .attr("text-anchor","middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "20px")
        .attr("fill", "white");

      // Step: 7 adding in tooltips
      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(d => {
        return (`<strong>${d.state}<strong>
        <hr>Poverty Percentage: ${d.poverty}%
        <hr>Healthcare Percentage: ${d.healthcare}%`);
      });

      // Step 8: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 9a: Create "mouseover" event listener to display tooltip
      circleLabels.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 10a: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
      });

      // adding tooltips for both circles and for labels
      // Step 9b: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 10b: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
      });      

      // Step 11: Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Healthcare Percentage");

      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Poverty Percentage");          

  });

}

// Import Data
function generateChart() {
    d3.csv("assets/data/data.csv").then(data => {
        console.log(data)
      
      // Step 1: Parse Data/Cast as numbers
      // Healthcare vs. Poverty or Smokers vs. Age
      data.forEach(row => {
        row.poverty = +row.poverty
        row.healthcare = +row.healthcare
      })

      // Step 2: Create scale functions

      // xScale (linear for poverty %)
      var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.poverty))
      .range([0, width]);

      console.log('Poverty Max ' + d3.max(data, d => d.poverty))

      // yScale (linear for healthcare %)
      var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.healthcare)])
      .range([height, 0]);

      console.log('HealthCare Max ' + d3.max(data, d => d.healthcare))

      // Step 3: Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // Step 4: Append Axes to the chart
      
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

      chartGroup.append("g")
        .call(leftAxis);
      
    // Step 5: Create Circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5");

    });

};

makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);