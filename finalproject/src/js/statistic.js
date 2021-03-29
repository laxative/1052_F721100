const SolarSystemAndEarthquakes = require('../data/SolarSystemAndEarthquakes.csv');


function barChar() {

    // clean li data and object
    var article_menu = document.getElementById('article_menu');
    article_menu.innerHTML = "";

    //data
    // d3.csv(SolarSystemAndEarthquakes, (data) => {
    	//console.log(data[0]);
  		var margin = {top: 40, right: 20, bottom: 30, left: 50};

      var final_Width = 1490;

  		var statistics_svg_width = final_Width - margin.left - margin.right, 
  				statistics_svg_height = (final_Width/2) - margin.top - margin.bottom;
  		var chart = d3.select("#screen").append('svg')
  				.attr({
  					id: "statistics",
  					width: statistics_svg_width + margin.left + margin.right,
  					height: statistics_svg_height + margin.top + margin.bottom
  				})
          .style({
                "border": "2px solid #fff",
                "background-color": "#777"
          })
  				.append('g')
  				.attr("transform", "translate(" + margin.top + "," + margin.left + ")");
          

  		//divide data by year
  		
      // initial
      var data_sort = [];
      for(var i=2005; i<=2015; ++i) {
        data_sort.push({
          "year": i,
          "data": []
        });
      }
      SolarSystemAndEarthquakes.forEach(item => {

        var year = parseInt(item.date.substring(6,10));

        data_sort[year-2005].data.push(item);

      });
			
  		//x axis
  		var x = d3.scale.ordinal()
          .rangeRoundBands([0, statistics_svg_width], .1);

      x.domain(data_sort.map(d => {return d.year}));

  		var xAxis = d3.svg.axis().scale(x).orient("bottom");

  		//y axis
  		var y = d3.scale.linear()
  						.domain([0,
  										d3.max(data_sort.map(d => {return d.data.length}))])
  						.range([statistics_svg_height, 0])

  		var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(-statistics_svg_width);


      var divTooltip = d3.select("body").select(".toolTip")
      										.style("display", "none");


      var bar = chart.selectAll('.bar').data(data_sort)
      				.enter().append('rect')
	      			.attr({
				       	"class": "bar",
				        "x": function(d) {return x(d.year);},
				        "y": statistics_svg_height,
				        "width": x.rangeBand(),
				        "height": 0
				      }).on("mousemove", function(d){
				        //use d3.event.pageX, d3.event.pageY to detect the position of mouse in page
				        //and change the div position by these two attribute
				        this.style.opacity = .8;
				        divTooltip.style("left", d3.event.pageX+10+"px");
				        divTooltip.style("top", d3.event.pageY-25+"px");
				        divTooltip.style("display", "inline-block");
				        //querySelectorAll is the new, easy, strong selector than jQuery
				        var elements = document.querySelectorAll(':hover');
				        l = elements.length - 1;
				        var elementData = elements[l].__data__;
				        divTooltip.html("Amount: " + elementData.data.length);
				      }).on("mouseout", function() {
				        this.style.opacity = 1;
				        divTooltip.style("display", "none");
				      });


  		chart.selectAll('.bar').transition().duration(500)
  			.attr({
  				"height": function(d) {return statistics_svg_height - y(d.data.length);},
  				"y": function(d) {return y(d.data.length);}
  			});
        
  		chart.append("g") //axis x
        .attr({
          "class": "x axis",
          "transform": "translate(0," + statistics_svg_height + ")"
        })
        .call(xAxis)
        .style("font", "10px sans-serif");

      chart.append("g") //axis y
        .attr("class", "y axis")
        .call(yAxis)
        .style("font", "10px sans-serif")
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Number");

		// });

}

module.exports = barChar