//This code plots a graph to show percentage of people renting homes vs the number of households
//that received foodstamps in the past 12 months. 

var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

//Setting chart width and height
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//Importing data from the data file -- foodstamps received vs renting homes
d3.csv("data/data.csv", function(err, rentData) {
  if (err) throw err;

  rentData.forEach(function(data) {
    //Cast the numeric data which is in string form as numeric
    data.percentRenting = +data.percentRenting;
    data.foodstampsNum = +data.foodstampsNum;
  });


  // Create scale functions

  //y-axis scale --all the points will be placed within 0 and height
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);

  //x-axis scale --all the points will be placed within 0 and width
  var xLinearScale = d3.scaleLinear()
    .range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain -- setting the min and max values on both axes
  //Mapping the scale to the domain
  xLinearScale.domain([0, d3.max(rentData, function(data) {
    return +data.foodstampsNum;
  })]);

  yLinearScale.domain([0, d3.max(rentData, function(data) {
    return +data.percentRenting * 1.2;
  })]);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var stateName = data.geography;
      var percentRenting = +data.percentRenting;
      var foodstampsNum = +data.foodstampsNum;
      return (stateName + "<br> Percent Renting: " + percentRenting + "<br> Food Stamps: " + foodstampsNum);
   });

  chart.call(toolTip);

  // Fill out the graph with circles 
  
  //At this point there are no circles yet 
  chart.selectAll("circle") 

    //as many circles as there are rows in rentData
    .data(rentData)

    //Now add the circles to the page
    .enter().append("circle")

      //plot num of households received foodstamps (demographic census data) on the x axis
      .attr("cx", function(data, index) {
        console.log(data.foodstampsNum);
        return xLinearScale(data.foodstampsNum);
      })

      //plot percent renting (behavorial risk data) on the y axis
      .attr("cy", function(data, index) {
        return yLinearScale(data.percentRenting);
      })

      //set the radius of each circle
      .attr("r", "10")

      //Fill the circle with a color
      .attr("fill", "cyan")

      //set up event listener for onclick on a circle
      .on("click", function(data) {
        toolTip.show(data);
      })

      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  chart.selectAll("text")
     //as many pieces of text as there are rows in rentData
    .data(rentData)

    //Now add the text to the page
    .enter().append("text")

      //pinning x & y locations for the text for each point in the dataset(foodstamps received) 
      .attr("x", function(data, index) {
        console.log(data.foodstampsNum);
        return xLinearScale(data.foodstampsNum);
      })
      .attr("y", function(data, index) {
        return yLinearScale(data.percentRenting);
      })  
      //now put the state abbr in there as text
      .text(function(data, index) {
        return data.stateAbbr;
      }) 
      .attr("font-family", "sans-serif")
          .attr("font-size", "10px")
          .attr("text-anchor","middle")
          .attr("fill","dark-blue")  

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  //Add y-axis label  
  chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.9))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("People renting homes (%)");
     

// Add x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Number of households received food stamps (past 12 months)");
});


