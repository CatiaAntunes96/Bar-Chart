let yMargin = 40,
width = 800,
heigth = 400,
barWidth = width/275;

let svgContainer = d3.select(".svg-container")
.append("svg")
.attr('width', width + 100)
.attr('heigth', heigth + 60);


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
})

    


