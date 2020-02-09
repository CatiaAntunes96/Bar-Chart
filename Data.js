document.addEventListener("DOMContentLoaded", () => {

    width = 800,
    height = 400,
    barWidth = width/275;

var tooltip = d3.select(".display-svg").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

var overlay = d3.select('.display-svg').append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgContainer =  d3.select('.display-svg')
    .append('svg')
    .attr('width', width + 100)
    .attr('height', height + 60);

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(data => {
        svgContainer.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -200)
        .attr('y', 80)
        .text('Gross Domestic Product');
      
      svgContainer.append('text')
        .attr('x', width/2 + 120)
        .attr('y', height + 50)
        .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
        .attr('class', 'info');
      
    //define the quarter of the elemeent selected
      let years = data.data.map(el => {
        let quarter;
        let month = el[0].substring(5, 7);
        if(month === '01') {
          quarter = 'Q1';
        }
        else if (month === '04'){
          quarter = 'Q2';
        }
        else if(month === '07') {
          quarter = 'Q3';
        }
        else if(month ==='10') {
          quarter = 'Q4';
        }
    
        return el[0].substring(0, 4) + ' ' + quarter
      });
      
      let yearsDate = data.data.map(el => new Date(el[0]));
      //Define the last year
      let xMax = new Date(d3.max(yearsDate));
      xMax.setMonth(xMax.getMonth() + 3);
      
      //Define the range of the x axis
      let xScale = d3.scaleTime()
        .domain([d3.min(yearsDate), xMax])
        .range([0, width]);
      
      let xAxis = d3.axisBottom()
            .scale(xScale);
      
    //Add x axis to svg
      let xAxisGroup = svgContainer.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(60, 400)');
      
    //Return de gpd´s values
      let GDP = data.data.map(el => el[1]);
      
    //Return the maximum gpd value
      let gdpMax = d3.max(GDP);
      
    //It allows the convertion of the gpd values
      let linearScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([0, height]);
      
     let scaledGDP = GDP.map(el => linearScale(el));
      
    //Defines the range of the y-axis
      let yAxisScale = d3.scaleLinear()
        .domain([0, gdpMax])
        .range([height, 0]);
      
    //Put the axis on the left side
      let yAxis = d3.axisLeft(yAxisScale)
      
      //Add y-axis to svg
      let yAxisGroup = svgContainer.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(60, 0)');
        
    //Add the bar to each data
      d3.select('svg').selectAll('rect')
        .data(scaledGDP)
        .enter()
        .append('rect')
        .attr('data-date', (d, i) => data.data[i][0])
        .attr('data-gdp', (d, i) =>  data.data[i][1])
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(yearsDate[i]))
        .attr('y', (d, i) => height - d)
        .attr('width', barWidth)
        .attr('height', function(d) {
          return d;
        })
        .style('fill', '#33adff')
        .attr('transform', 'translate(60, 0)')
        .on('mouseover', function(d, i) {
          overlay.transition()
            .duration(0)
            .style('height', d + 'px')
            .style('width', barWidth + 'px')
            .style('opacity', .9)
            .style('left', (i * barWidth) + 0 + 'px')
            .style('top', height - d + 'px')
            .style('transform', 'translateX(60px)');
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(years[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
            .attr('data-date', data.data[i][0])
            .style('left', (i * barWidth) + 30 + 'px')
            .style('top', height - 100 + 'px')
            .style('transform', 'translateX(60px)');
        })
        .on('mouseout', function(d) {
          tooltip.transition()
            .duration(200)
            .style('opacity', 0);
          overlay.transition()
            .duration(200)
            .style('opacity', 0);
        })
    
    });

})
