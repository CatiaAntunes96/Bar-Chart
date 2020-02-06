let yMargin = 40,
    width = 800,
    heigth = 400,
    barWidth = width/275;

let svgContainer = d3.select(".svg-container")
                        .append("svg")
                        .attr('width', width + 100)
                        .attr('heigth', heigth + 60)
                        .append("p")
            .text('Gross Domestic Product')

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(data) {
    

svgContainer.append("p")
            .text('Gross Domestic Product')
  
})