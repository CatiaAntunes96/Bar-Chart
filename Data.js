let yMargin = 40,
width = 800,
heigth = 400,
barWidth = width/275;

let svgContainer = d3.select(".svg-container")
.append("svg")
.attr('width', width + 100)
.attr('heigth', heigth + 60);

let tooltip = d3.select(".svg-container")
                .append("div")
                .attr('id', "tooltip")
                .style("opacity", 0);

let overlay = d3.select("svg-container")
                .append("div")
                .attr("class", "overlay")
                .style("opacity", 0);



d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json") 
.then(data => {
    //Add vertical text
    svgContainer.append("text")
    .attr('transform', "rotate(-90)")
    .attr("x", -200)
    .attr("y", 80)
    .text("Gross Domestic Product")
    
    //Add horizontal text
    svgContainer.append("text")
    .attr("x", width/2 + 120)
    .attr("y", heigth + 50)
    .text("'More Information: http://www.bea.gov/national/pdf/nipaguid.pdf'")
    .attr('class', 'info');
    

    //return year plus quarter which inserts
    let quarters = data.data.map(item => {
        let quarter;
        let mounth = item[0].substring(5, 7);
        if(mounth === '01') {
            quarter = 'Q1';
        }
        else if (mounth === '04'){
            quarter = 'Q2';
        }
        else if(mounth === '07') {
            quarter = 'Q3';
        }
        else if(mounth ==='10') {
            quarter = 'Q4';
        }
        return item[0].substring(0, 4) + ' ' + quarter;
    });

    //convert years to date
    let yearsDate = data.data.map(item => {
        return new Date(item[0]);
    });

    //Find the last date and add one more quarter for de domain
    let xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    
    //Find de domain and range of x axis
    let xScale = d3.scaleTime()
                    .domain([d3.min(yearsDate), xMax])
                    .range([0, width]);
            
    let xAxis = d3.axisBottom()
                    .scale(xScale);
    
    let xAxisGroup = svgContainer.append("g")
                                .call(xAxis)
                                .attr("id", "x-axis")
                                .attr("transform", "translate(60, 400)");

    //Give the gdp value of each year
    let GDP = data.data.map(el => {
        return el[1]
    })
    
    //let scaleGDP = [];

    //Select min GDP value
    let minGDP = d3.min(GDP)
    //Select max gdp value
    let maxGDP = d3.max(GDP)
    
    
    let linearScale = d3.scaleLinear()
                        .domain([0, maxGDP])
                        .range([0, heigth]);
    
    let scaleGDP = GDP.map(el => {
        return linearScale(el)
    })
    //defines range and domain for y axis
    let yAxisScale = d3.scaleLinear()
                        .domain([0, maxGDP])
                        .range([heigth, 0]);

    let yAxis = d3.axisLeft(yAxisScale);

    let yAxisGroup = svgContainer.append("g")
                                    .call(yAxis)
                                    .attr('id', "y-axis")
                                    .attr("transform", "translate(60, 0)");

    d3.select("svg").selectAll("rect")
        .data(scaleGDP)
        .enter()
        .append("rect")
        .attr('date-date', (d, i) => {
            return data.data[i][0]
        })
        .attr("data-gdp", (d, i) => {
            return data.data[i][1]
        })
        .attr("class", "bar")
        .attr("x", (d, i) => {
            return xScale(yearsDate[i])
        })
        .attr("y", (d, i) => {
            return heigth - d
        })
        .attr('width', barWidth)
        .attr("heigth", d => d)
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
            tooltip.html(quarters[i] + '<br>' + '$' + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
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
          });

})

