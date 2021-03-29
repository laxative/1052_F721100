const SolarSystemAndEarthquakes = require('../data/SolarSystemAndEarthquakes.csv');


function houseNumber() {
	 // clean li data and object
    var article_menu = document.getElementById('article_menu');
    article_menu.innerHTML = "";

    //data
    // d3.csv(SolarSystemAndEarthquakes, (data) => {
    	//console.log(data[0]);

      var final_Width = 1490;

  		var statistics_svg_width = final_Width, 
  				statistics_svg_height = (final_Width/2);

  		var radius = Math.min(statistics_svg_width/2, statistics_svg_height-50) / 2;

      // define color

  		var color = {
        "Year: 2005": "#00CCCC",
        "Year: 2006": "#00ADAD",
        "Year: 2007": "#00A3A3",
        "Year: 2008": "#009999",
        "Year: 2009": "#008F8F",
        "Year: 2010": "#008585",
        "Year: 2011": "#ADADFF",
        "Year: 2012": "#8C8CFF",
        "Year: 2013": "#7878FF",
        "Year: 2014": "#6363FF",
        "Year: 2015": "#4545FF",
        "HouseNumber: 1": "#CA82FF",
        "HouseNumber: 2": "#C26EFF",
        "HouseNumber: 3": "#B54FFF",
        "HouseNumber: 4": "#A830FF",
        "HouseNumber: 5": "#9F1CFF",
        "HouseNumber: 6": "#9300FF",
        "HouseNumber: 7": "#7600CC",
        "HouseNumber: 8": "#FF30FF",
        "HouseNumber: 9": "#FF00FF",
        "HouseNumber: 10": "#D600D6",
        "HouseNumber: 11": "#B200B2",
        "HouseNumber: 12": "#FF82FF",
        "personal": "#FFAC12",
        "sociable": "#FFC14F",
        "universal": "#E09200"
      };

      var sequence = d3.select("#screen").append('div').attr({
        'id': 'sequence',
        'width': '600px',
        'height': '50px'
      }) 

  		var chart = d3.select("#screen").append('svg')
  				.attr({
  					id: "statistics",
  					width: statistics_svg_width,
  					height: statistics_svg_height - 50
  				})
  				.append('g')
  				.attr("id", "container")
  				.attr("transform", "translate(" + statistics_svg_width/2 + "," 
  						+ (statistics_svg_height - 50)/2 + ")");

  		// sort data
  		
      // initial
      var housenumber = [{
      	"name": "Sun",
      	"children": []
      },{
      	"name": "Moon",
      	"children": []
      },{
      	"name": "Mercury",
      	"children": []
      },{
      	"name": "Venus",
      	"children": []
      },{
      	"name": "Mars",
      	"children": []
      },{
      	"name": "Jupiter",
      	"children": []
      },{
      	"name": "Saturn",
      	"children": []
      },{
      	"name": "Uranus",
      	"children": []
      },{
      	"name": "Neptune",
      	"children": []
      },{
      	"name": "Pluto",
      	"children": []
      }];

      for (var i = 2005; i <= 2015; i++) {
      	housenumber.forEach((item) => {
      		item.children.push({
        		"name": "Year: " + i,
            "children": function() {
              var temp = new Array();
              for(var n = 1; n <= 3; n++) {
                temp.push({
                  "name": function(n) {
                    if(n === 1) return "personal";
                    else if(n === 2) return "sociable";
                    else return "universal";
                  }(n),
                  "children": function() {
                    var temp2 = new Array();
                    for(var j=n*4-3; j<=n*4; ++j) {
                      temp2.push({
                        "name": "HouseNumber: " + j,
                        "size": 0
                      });
                    }
                    return temp2;
                  }()
                });
              }
              return temp;
            }()
       		});
      	});
      }
      
      console.log(housenumber);

      SolarSystemAndEarthquakes.forEach((item) => {
      	var year = parseInt(item.date.substring(6,10));
      	var sun = Math.floor(item.Sun_housenumber);
      	var moon = Math.floor(item.Moon_housenumber);
      	var mercury = Math.floor(item.Mercury_housenumber);
      	var venus = Math.floor(item.Venus_housenumber);
      	var mars = Math.floor(item.Mars_housenumber);
      	var jupiter = Math.floor(item.Jupiter_housenumber);
      	var saturn = Math.floor(item.Saturn_housenumber);
      	var uranus = Math.floor(item.Uranus_housenumber);
      	var neptune = Math.floor(item.Neptune_housenumber);
      	var pluto = Math.floor(item.Pluto_housenumber);


      	housenumber[0].children[year-2005].children[Math.floor((sun-1)/4)].children[(sun-1)%4].size++;
      	housenumber[1].children[year-2005].children[Math.floor((moon-1)/4)].children[(moon-1)%4].size++;
      	housenumber[2].children[year-2005].children[Math.floor((mercury-1)/4)].children[(mercury-1)%4].size++;
      	housenumber[3].children[year-2005].children[Math.floor((venus-1)/4)].children[(venus-1)%4].size++;
      	housenumber[4].children[year-2005].children[Math.floor((mars-1)/4)].children[(mars-1)%4].size++;
      	housenumber[5].children[year-2005].children[Math.floor((jupiter-1)/4)].children[(jupiter-1)%4].size++;
      	housenumber[6].children[year-2005].children[Math.floor((saturn-1)/4)].children[(saturn-1)%4].size++;
      	housenumber[7].children[year-2005].children[Math.floor((uranus-1)/4)].children[(uranus-1)%4].size++;
      	housenumber[8].children[year-2005].children[Math.floor((neptune-1)/4)].children[(neptune-1)%4].size++;
      	housenumber[9].children[year-2005].children[Math.floor((pluto-1)/4)].children[(pluto-1)%4].size++;
      });
			
      console.log(housenumber);

      
			var partition = d3.layout.partition()
          .size([2 * Math.PI, radius * radius])
          .value(function(d) {return d.size;});

			var arc = d3.svg.arc()
			    .startAngle(function(d) { return d.x; })
			    .endAngle(function(d) { return d.x + d.dx; })
			    .innerRadius(function(d) { return Math.sqrt(d.y); })
			    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });


			// add eventlistener to li (2005 to 2015)
			d3.select('#article_menu').selectAll('li')
				.data(["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto"])
				.enter().append('li')
				.attr('value', function(d) {return d;})
				.text((d) => {return d;})
				.on('click', function(d,i) {
          console.log(i);
          generateChart(i);
        });


      function generateChart(item) {

        var totalSize = 1406;

        var nodes = partition.nodes(housenumber[item])
          .filter(function(d) {
          return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
        });


        // UPDATE

        var path = chart.data([housenumber[item]]).selectAll("path")
          .data(nodes)
          .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
          .attr("d", arc)
          .style("stroke", "#fff")
          .style("fill", function(d) { return color[d.name] })
          .style("fill-rule", "evenodd")
          .on("mouseover", mouseover)
          .on('mouseout', function(d) {
            d3.select('.percentage').text('');
            d3.select('.type').text('');

            d3.selectAll('path').style('opacity','1');

            d3.select("#trail")
            .style("visibility", "hidden");

          });

        // ENTER

      	var path = chart.data([housenumber[item]]).selectAll("path")
      		.data(nodes)
    			.enter().append("path")
      		.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      		.attr("d", arc)
          .style("stroke", "#fff")
      		.style("fill", function(d) { return color[d.name]; })
      		.style("fill-rule", "evenodd")
          .on("mouseover", mouseover)
          .on('mouseout', function(d) {
            d3.select('.percentage').text('');
            d3.select('.type').text('');

            d3.selectAll('path').style('opacity','1');

            d3.select("#trail")
            .style("visibility", "hidden");

          });
      		//.on("mouseover", mouseover);

          chart.append('text')
             .attr('class', 'center-txt type')
             .attr('text-anchor', 'middle')
             .attr("fill", "#fff")
             .attr("dy", radius * -0.16)
             .style("font-size", ".9em");

          chart.append('text')
             .attr('class', 'center-txt percentage')
             .attr('text-anchor', 'middle')
             .attr("fill", "#fff")
             .attr("dy", radius * 0.16)
             .style("font-size", "2em");

          d3.selectAll('path').style('opacity','1');

      		//console.log(totalSize);

        function getAncestors(node) {
          var path = [];
          var current = node;
          while (current.parent) {
            path.unshift(current);
            current = current.parent;
          }
          return path;
        }

        function mouseover(d) {
          var percentage = (100 * d.value / totalSize).toPrecision(3);
              var percentageString = percentage + "%";
              if (percentage < 0.5) {
                percentageString = "< 0.5%";
              }
            d3.select('.percentage').text(percentageString);
            d3.select('.type').text(d.name);

            var sequenceArray = getAncestors(d);

            d3.selectAll('path').style('opacity','.3');

            chart.selectAll("path")
              .filter(function(node) {
                        return (sequenceArray.indexOf(node) >= 0);
                      })
              .style("opacity", 1);

            updateSequence(sequenceArray, percentageString);
        }

      }

      var b = {
        w: 170, h: 40, s: 15, t: 20
      };

      // for sequence
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", statistics_svg_width)
        .attr("height", 50)
        .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
          .attr("id", "endlabel")
          .style("fill", "#000");

      function breadcrumbPoints(d, i) {
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
          points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
      }


      function updateSequence(nodeArray, percentageString) {
        // Data join; key function combines name and depth (= position in sequence).
        var g = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function(d) { return d.name + d.depth; });

        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append("svg:g");

        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function(d) { return color[d.name]; });

        entering.append("svg:text")
            .attr("x", (b.w + b.t) / 2)
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.name; });

        // Set position for entering and updating nodes.
        g.attr("transform", function(d, i) {
          return "translate(" + i * (b.w + b.s) + ", 0)";
        });

        // Remove exiting nodes.
        g.exit().remove();

        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
            .style("visibility", "");
      }

      generateChart(0);

  // });
}


module.exports = houseNumber