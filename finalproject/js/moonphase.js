function moonphase() {

    // clean li data and object
    var article_menu = document.getElementById('article_menu');
    article_menu.innerHTML = "";

    //data
    d3.csv("../data/SolarSystemAndEarthquakes.csv", (data) => {
    	//console.log(data[0]);
  		var margin = {top: 40, right: 20, bottom: 30, left: 30};

      var final_Width = Math.min(document.getElementById('screen').offsetWidth
      ,(document.getElementById('screen').offsetHeight)*2);

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
      data.forEach(item => {

        var year = parseInt(item.date.substring(6,10));
        item.moonPhaseGroup = function(d) {
          if(d.MoonPhase_value < 2) return 1;  //新月
          else if(d.MoonPhase_value < 7) return 2; //娥眉月
          else if(d.MoonPhase_value < 9) return 3; //上弦月
          else if(d.MoonPhase_value < 15) return 4; //盈凸月
          else if(d.MoonPhase_value < 18) return 5; //滿月
          else if(d.MoonPhase_value < 22) return 6; //虧凸月
          else if(d.MoonPhase_value < 25) return 7; //下弦月
          else return 8;  //殘月
        }(item);
        data_sort[year-2005].data.push(item);

      });

      //console.log(data_sort[0])

      // for barChart
      var barChart = chart.append("g").attr({
        'class': 'barChart'
      }); 

      var x = d3.scale.ordinal().rangeRoundBands([statistics_svg_width/2, statistics_svg_width], .1);

      x.domain(["新月","娥眉月","上弦月","盈凸月","滿月","虧凸月","下弦月","殘月"]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom");

      var y = d3.scale.linear()
        .domain([0, 65])
        .range([statistics_svg_height, 0]); 


      barChart.append("g") //axis x
        .attr({
          "class": "x axis",
          "transform": "translate(0," + statistics_svg_height + ")"
        })
        .call(xAxis)
        .style("font", "10px sans-serif");  


      // bar chart show all data
      function showAllData() {
        var MoonPhaseData = [{
          "MoonPhase": "新月",
          "number": 0
        },{
          "MoonPhase": "娥眉月",
          "number": 0
        },{
          "MoonPhase": "上弦月",
          "number": 0
        },{
          "MoonPhase": "盈凸月",
          "number": 0
        },{
          "MoonPhase": "滿月",
          "number": 0
        },{
          "MoonPhase": "虧凸月",
          "number": 0
        },{
          "MoonPhase": "下弦月",
          "number": 0
        },{
          "MoonPhase": "殘月",
          "number": 0
        }];

        for(var i = 2005; i<= 2015; ++i) {
          data_sort[i-2005].data.forEach(item => {
            MoonPhaseData[item.moonPhaseGroup-1].number += 1;
          });
        }

        // UPDATE
      barChart.selectAll('.bar').data(MoonPhaseData)
          .transition().duration(500)
          .attr({
            "height": function(d) {return statistics_svg_height - y(d.number/7);},
            "y": function(d) {return y(d.number/7)}
        });


      // ENTER
      barChart.selectAll('.bar').data(MoonPhaseData)
          .enter().append('rect')
          .attr({
            "class": "bar",
            "x": function(d) {return x(d.MoonPhase);},
            "y": statistics_svg_height,
            "width": x.rangeBand(),
            "height": 0
          })
          .transition().duration(500)
          .attr({
            "height": function(d) {return statistics_svg_height - y(d.number/7);},
            "y": function(d) {return y(d.number/7);}
        });

      // UPDATE
      barChart.selectAll('.bartext').data(MoonPhaseData)
        .transition().duration(500)
        .attr('y', function(d) {return y(d.number/7) - 5})
        .text(function(d) {return d.number;});


      // ENTER
      barChart.selectAll('.bartext').data(MoonPhaseData)
        .enter().append('text')
        .attr({
          'class': 'bartext',
          'x': function(d) {return x(d.MoonPhase) + x.rangeBand()/2;},
          'y': statistics_svg_height - 5
        }).transition().duration(500)
        .attr('y', function(d) {return y(d.number/7) - 5})
        .text(function(d) {return d.number;})
        .attr('text-anchor', 'middle');
      };


      // for bar chart(to show the number of earthquake on certain moonphase)
      function barChartUpdate(year) {

      /*              */

      // deal with y data first

      var MoonPhaseData = [{
        "MoonPhase": "新月",
        "number": 0
      },{
        "MoonPhase": "娥眉月",
        "number": 0
      },{
        "MoonPhase": "上弦月",
        "number": 0
      },{
        "MoonPhase": "盈凸月",
        "number": 0
      },{
        "MoonPhase": "滿月",
        "number": 0
      },{
        "MoonPhase": "虧凸月",
        "number": 0
      },{
        "MoonPhase": "下弦月",
        "number": 0
      },{
        "MoonPhase": "殘月",
        "number": 0
      }];

      //console.log(MoonPhaseData);

      data_sort[year-2005].data.forEach(item => {
        MoonPhaseData[item.moonPhaseGroup-1].number += 1;
      });

      // UPDATE
      barChart.selectAll('.bar').data(MoonPhaseData)
          .transition().duration(500)
          .attr({
            "height": function(d) {return statistics_svg_height - y(d.number);},
            "y": function(d) {return y(d.number)}
        });


      // ENTER
      barChart.selectAll('.bar').data(MoonPhaseData)
          .enter().append('rect')
          .attr({
            "class": "bar",
            "x": function(d) {return x(d.MoonPhase);},
            "y": statistics_svg_height,
            "width": x.rangeBand(),
            "height": 0
          })
          .transition().duration(500)
          .attr({
            "height": function(d) {return statistics_svg_height - y(d.number);},
            "y": function(d) {return y(d.number);}
        });

      // UPDATE
      barChart.selectAll('.bartext').data(MoonPhaseData)
        .transition().duration(500)
        .attr('y', function(d) {return y(d.number) - 5})
        .text(function(d) {return d.number;});


      // ENTER
      barChart.selectAll('.bartext').data(MoonPhaseData)
        .enter().append('text')
        .attr({
          'class': 'bartext',
          'x': function(d) {return x(d.MoonPhase) + x.rangeBand()/2;},
          'y': statistics_svg_height - 5
        }).transition().duration(500)
        .attr('y', function(d) {return y(d.number) - 5})
        .text(function(d) {return d.number;})
        .attr('text-anchor', 'middle');
      };



      // for donut chart(to show data group by year)
      var donutChart = chart.append("g").attr({
        "class": "donutChart",
        "transform": "translate("  + statistics_svg_width/4.75 + "," 
          + statistics_svg_height/1.85 + ")"
      });
      
      var color = d3.scale.category20c();

      var pie = d3.layout.pie().value((d) => {return d.data.length})
        .sort(null);

      var radius = Math.min(statistics_svg_width/2,statistics_svg_height) / 2;

      var arc = d3.svg.arc()
        .innerRadius(radius * 0.75)
        .outerRadius(radius);

      var path = donutChart.selectAll(".arc")
        .data(pie(data_sort))
        .enter().append("g")
        .attr("class", "arc");

      path.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .on('mouseover', function(d, i) {
          d3.select(this).transition()
            .duration(750)
            .ease('bounce')
            .attr('d', d3.svg.arc()
              .innerRadius(radius * 0.75)
              .outerRadius(radius * 1.13)
            );
          d3.select('.value').text(function(d) {
            var value = d3.selectAll('.arc').data()[i];
            return "Amount: " + value.value;
          });
          d3.select('.percentage').text(function(d) {
            var value = d3.selectAll('.arc').data()[i];
            var sum = d3.sum(d3.selectAll('.arc').data(), function(d) {
              return d.value;
            });
            return (value.value / sum * 100).toFixed(2) + "%";
          });
          d3.select('.type').text(function(d) {
            var type = d3.selectAll('.arc').data()[i];
            return "Year: " + type.data.year;
          });
          var select = d3.selectAll('.arc').data()[i];

          barChartUpdate(select.data.year);
        })
        .on('mouseout', function(d) {
          d3.select(this).transition()
            .duration(750)
            .ease('bounce')
            .attr('d', d3.svg.arc()
              .innerRadius(radius * 0.75)
              .outerRadius(radius)
            );
          d3.select('.value').text(function(d) {
            var sum = d3.sum(d3.selectAll('.arc').data(), function(d) {
              return d.value;
            });
            return "Amount: " + sum;
          });
          d3.select('.percentage').text('');
          d3.select('.type').text('Earthquake');
          showAllData();
        });
      


       // for data inside
       donutChart.append("svg:circle").attr("r",radius * 0.6)
        .style("fill","#E7E7E7")
        .on('mouseover', function(d) {
          d3.select(this).transition().duration(300)
            .attr("r", radius * 0.65);
        })
        .on('mouseout', function(d) {
          d3.select(this).transition().duration(300)
            .attr("r", radius * 0.6);
        });

       donutChart.append("text").attr({
        'class': 'center-txt type',
        "y": radius * -0.16,
        'text-anchor': 'middle',
        'font-weight': 'bold'
       }).text("Earthquake");

       donutChart.append('text')
             .attr('class', 'center-txt value')
             .attr('text-anchor', 'middle')
             .text(function(d) {
            var sum = d3.sum(d3.selectAll('.arc').data(), function(d) {
              return d.value;
            });
            return "Amount: " + sum;
          });;

       donutChart.append('text')
             .attr('class', 'center-txt percentage')
             .attr('y', radius * 0.16)
             .attr('text-anchor', 'middle');
      
      showAllData();

  	});	

}
