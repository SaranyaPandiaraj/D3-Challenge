// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(Health_Poverty, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Health_Poverty, d => d[chosenXAxis]) * 0.8,
      d3.max(Health_Poverty, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(Health_Poverty, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Health_Poverty, d => d[chosenYAxis]) * 0.8,
      d3.max(Health_Poverty, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return YLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var bottomAxis = d3.axisBottom(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(2000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}



// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var label = "Hair Length:";
  }
  else {
    var label = "# of Albums:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv", function(err, Health_Poverty) {
  if (err) throw err;

  // parse data
  Health_Poverty.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
	data.income = +data.income;
	data.obesity = +data.obesity;
	data.smokes = +data.smokes;
	data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(Health_Poverty, chosenXAxis);
  
  // yLinearScale function above csv import
  var yLinearScale = yScale(Health_Poverty, chosenYAxis);


  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("text")
        .attr("transform", `translate(${width - 40},${height - 5})`)
        .attr("class", "axis-text-main")
        .text("Demographics")

  chartGroup.append("text")
        .attr("transform", `translate(15,60 )rotate(270)`)
        .attr("class", "axis-text-main")
        .text("Behavioral Risk Factors")
		
  // append state circles
  var StatecirclesGroup = chartGroup.selectAll("circle")
    .data(Health_Poverty)
    .enter()
    .append("circle")
	.classed('stateCircle',true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");
	
  var StateTextGroup = chartGroup.append('g').selectAll('text')
	.data(data)
	.enter()
	.append('text')
	.classed('stateText',true)
	.attr('x', d => xScale(d[chosenXAxis]))
	.attr('y', d => yScale(d[chosenYAxis]))
	.attr('transform','translate(0,4.5)')
	.text(d => d.abbr)   

  // Create group for  x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
	
  var povertyLabel = xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 20)
	.attr('value', 'poverty')
	.classed('aText active', true)
	.text('In Poverty (%)');

	var ageLabel = xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 40)
	.attr('value', 'age')
	.classed('aText inactive', true)
	.text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 60)
	.attr('value', 'income')
	.classed('aText inactive', true)
	.text('Household Income (Median)');	

	// Create group for  y- axis labels
    var yLabelsGroup = chartGroup.append('g')

	var HealthLabel = yLabelsGroup.append('text')
	.attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	.attr('value', 'healthcare')
	.classed('aText active', true)
	.text('Lacks Healthcare (%)');

	var smokesLabel = yLabelsGroup.append('text')
	.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	.attr('value', 'smokes')
	.classed('aText inactive', true)
	.text('Smokes (%)');

    var obesityLabel = yLabelsGroup.append('text')
	.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	.attr('value', 'obesity')
	.classed('aText inactive', true)
	.text('Obesse (%)');


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(Health_Poverty, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "num_albums") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});
