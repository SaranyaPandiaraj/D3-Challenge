// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 700;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .classed('chart',true)
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";



/********************************************************************************
							Function Declarations
*********************************************************************************/


// function used for updating x-scale var upon click on axis label
function xScale(Health_Poverty, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Health_Poverty, d => d[chosenXAxis]) * 0.85,
			 d3.max(Health_Poverty, d => d[chosenXAxis]) * 1.07])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(Health_Poverty, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Health_Poverty, d => d[chosenYAxis]) * 0.85,
			 d3.max(Health_Poverty, d => d[chosenYAxis]) * 1.07])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
	
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
	.ease(d3.easeBack)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
	
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
	.ease(d3.easeBack)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderXCircles(StatecirclesGroup, newXScale, chosenXaxis) {

  StatecirclesGroup.transition()
    .duration(1000)
	.ease(d3.easeBack)
	.on('start',function(){
	d3.select(this)
	.attr("opacity", 0.50)
	.attr('r',17);
	})
	.on('end',function(){
	d3.select(this)
	.attr("opacity", 1.50)
	.attr('r',13)
	})
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return StatecirclesGroup;
}

function renderYCircles(StatecirclesGroup, newYScale, chosenYaxis) {

  StatecirclesGroup.transition()
    .duration(1000)
	.ease(d3.easeBack)
	.on('start',function(){
	d3.select(this)
	.attr("opacity", 0.50)
	.attr('r',17);
	})
	.on('end',function(){
	d3.select(this)
	.attr("opacity", 1.50)
	.attr('r',13)
	})
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return StatecirclesGroup;
}

//function used for rendering Texts
function renderXText(newXScale, chosenXaxis) {

var stateXText = d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('x', d => newXScale(d[chosenXAxis]));
return 	stateXText;				
}
					
function renderYText(newYScale, chosenYaxis) {

var stateYText = d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('y', d => newYScale(d[chosenYAxis]));

return stateYText;
}




// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup) {
var toolTip = d3.tip()
        .attr('class','d3-tip')
       // .offset([80, -60])
        .html( d => {
        	if(chosenXAxis === "poverty")
	            return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:${d[chosenXAxis]}%`)
        	else if (chosenXAxis === "income")
	            return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:$${d[chosenXAxis]}`)
	        else
	        	return (`${d.state}<br>${chosenYAxis}:${d[chosenYAxis]}% 
	            		<br>${chosenXAxis}:${d[chosenXAxis]}`)
	    });

 
	StatecirclesGroup.call(toolTip);
	StatecirclesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	d3.selectAll('.StateTextGroup').call(toolTip);
	d3.selectAll('.StateTextGroup').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	return StatecirclesGroup;
	return StateTextGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("../assets/data/data.csv").then( Health_Poverty => {

  // parse data
  Health_Poverty.forEach(function(data){
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
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(yAxis);
		
  // append state circles
  var StatecirclesGroup = chartGroup.selectAll("circle")
    .data(Health_Poverty)
    .enter()
    .append("circle")
	.classed('stateCircle',true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 13)
	
  var StateTextGroup = chartGroup.append('g').selectAll('text')
	.data(Health_Poverty)
	.enter()
	.append('text')
	.classed('stateText',true)
	.attr('x', d => xLinearScale(d[chosenXAxis]))
	.attr('y', d => yLinearScale(d[chosenYAxis]))
	.attr('transform','translate(0,4.5)')
	.text(d => d.abbr)   

  // Create group for  x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
	
  var povertyLabel = xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 25)
	.attr('value', 'poverty')
	.classed('aText active', true)
	.text('In Poverty (%)');

	var ageLabel = xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 50)
	.attr('value', 'age')
	.classed('aText inactive', true)
	.text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
	.attr('x', 0)
	.attr('y', 70)
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
	.attr("transform", `translate(-65,${height / 2})rotate(-90)`)
	.attr('value', 'smokes')
	.classed('aText inactive', true)
	.text('Smokes (%)');

    var obesityLabel = yLabelsGroup.append('text')
	.attr("transform", `translate(-85,${height / 2})rotate(-90)`)
	.attr('value', 'obesity')
	.classed('aText inactive', true)
	.text('Obese (%)');


  // updateToolTip function above csv import
  var StatecirclesGroup = updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup);
  var StateTextGroup = updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup);
  
  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;
		//console.log(chosenXAxis)

        
        // updates x scale for new data
        xLinearScale = xScale(Health_Poverty, chosenXAxis);
		//console.log(xLinearScale)

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
		//console.log(xAxis)
		
		//console.log(StatecirclesGroup);
        // updates circles with new x values

        StatecirclesGroup = renderXCircles(StatecirclesGroup, xLinearScale, chosenXAxis);
		StateTextGroup = renderXText(xLinearScale, chosenXAxis);
		

        // updates tooltips with new info
        StatecirclesGroup = updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup),
		StateTextGroup = updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup);

        // changes classes to change bold text
        if (chosenXAxis === 'poverty') {
		    povertyLabel
		    .classed('active', true)
		    .classed('inactive', false);
		    incomeLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    ageLabel
		    .classed('active', false)
		    .classed('inactive', true);
		     }
		else if (chosenXAxis === 'age'){
		   	povertyLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    incomeLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    ageLabel
		    .classed('active', true)
		    .classed('inactive', false);
		     }
		else {
		   	povertyLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    incomeLabel
		    .classed('active', true)
		    .classed('inactive', false);
		    ageLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    }
		}
	});
	
	// y axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYaxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(Health_Poverty, chosenYAxis);

        // updates y axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new y values
        StatecirclesGroup = renderYCircles(StatecirclesGroup, yLinearScale, chosenYAxis);
		StateTextGroup = renderYText(yLinearScale, chosenYAxis);

        // updates tooltips with new info
        StatecirclesGroup = updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup),
		StateTextGroup = updateToolTip(chosenYAxis,chosenXAxis, StatecirclesGroup, StateTextGroup);

        // changes classes to change bold text
        if (chosenYAxis === 'healthcare') {
		    HealthLabel
		    .classed('active', true)
		    .classed('inactive', false);
		    smokesLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    obesityLabel
		    .classed('active', false)
		    .classed('inactive', true);
		     }
		else if (chosenYAxis === 'obesity'){
		   	HealthLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    smokesLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    obesityLabel
		    .classed('active', true)
		    .classed('inactive', false);
		     }
		else {
		   	HealthLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    smokesLabel
		    .classed('active', true)
		    .classed('inactive', false);
		    obesityLabel
		    .classed('active', false)
		    .classed('inactive', true);
		    }
		}
	});
});
