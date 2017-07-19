function setMap() {

		// clean li data and object
		var article_menu = document.getElementById('article_menu');
		article_menu.innerHTML = "";


		var base_Width = 960;

		var final_Width = Math.min(document.getElementById('screen').offsetWidth
			,(document.getElementById('screen').offsetHeight)*2);

		var width = final_Width,
				height = width/2;
				
		var svg = d3.select('#screen').append('svg')
							.attr({
								width: width,
								height: height
							}).style({
								"border": "2px solid #fff",
    						"background-color": "#a4bac7"
							});

		//draw map

		// create a first guess for the projection (d3.geo.projection.v2.min.js)
    	var scale  = 153*(1+((width-base_Width)/base_Width));
    	var offset = [width/2, height/2];
    	var center = [0, 0];
    	var projection = d3.geo.equirectangular().scale(scale)
        .translate(offset)
        .precision(.1)
        .rotate([-180,0])
        .center(center); 

      //d3.geo.miller()
			//in d3.geo.projection
			//is a modified Mercator projection

			//Scale is the function that determines the scale transformation from a location (latitude and longitude) to point (x,y).
			//default is 150


      //d3.geo.mercator()  麥卡托投影
			//d3.geo.gnomonic()  日規投影
			//d3.geo.equirectangular()  等距柱狀投影
			//d3.geo.conicEquidistant()  等距圓錐投影
			//d3.geo.conicEqualArea()  等積圓錐投影
			//d3.geo.orthographic()  正投影
			//d3.geo.stereographic()  球極平面投影
			//d3.geo.transverseMercator()  橫麥卡托投影
	    
	    //create path
			var path = d3.geo.path()
	    .projection(projection);
	    
	    /*
	    //d3.geo.graticule()  經緯網
	    var graticule = d3.geo.graticule();

	    g.append("path")
	    	//!important, use .datum(), not use .data()
	    	.datum(graticule)
	    	.attr("class", "graticule")
	    	.attr("d", path);
			*/

		var graticule = d3.geo.graticule();

		// load and display the World
		d3.json("../data/world-110m.json", (error, topology) => {
			if(error)  throw error;
			//console.log(topology);
			//topojson
			//console.log(topology.objects["countries"])

			//draw land
			svg.append("g")
      	.attr("class", "land")
    		.selectAll("path")
    		//Returns the GeoJSON Feature or FeatureCollection for the specified object in the given topology
      	.data([topojson.object(topology, topology.objects.land)])
    		.enter().append("path")
      	.attr("d", path);
      	
      //draw countries
  		svg.append("g")
  			.attr("class", "land-borders")
  			.selectAll("boundary")
      	.data([topojson.object(topology, topology.objects.countries)])
      	
      	//topojson.mesh(topology,object,function(a,b) {return a !== b})
				//return a GEOJson MultiLineString geometry object 
      	.enter().append("path")
      	.attr("d", path);

      //draw graticule
      svg.append("g")
				.attr("class", "graticule")
				.selectAll("path")
				.data(graticule.lines)
				.enter().append("path")
				.attr("d", path);

		});

    d3.select(self.frameElement).style("height", height + "px");

    //data
    d3.csv("../data/SolarSystemAndEarthquakes.csv", (data) => {
    	//console.log(data[0]);

  		// divide data by year

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

  			data_sort[year-2005].data.push(item);

  		});


  		var divTooltip = d3.select("body").select(".toolTip")
      										.style("display", "none");


  		var event = svg.append("g").attr("class","event").selectAll("circle")
				.data(data_sort[0].data.map((d) => {
					return {
						"position": [d.longitude,d.latitude],
						"data": d
					};
				})).enter()
				.append("circle")
				.attr("cx", (d) => { return projection(d.position)[0]; })
				.attr("cy", (d) => { return projection(d.position)[1]; })
				.attr("fill", "red")
				.attr("r", 1e-6)
				.on("mousemove", function(d){
				  //use d3.event.pageX, d3.event.pageY to detect the position of mouse in page
				  //and change the div position by these two attribute
				  divTooltip.style("left", d3.event.pageX+10+"px");
		      divTooltip.style("top", d3.event.pageY-25+"px");
		      divTooltip.style("display", "inline-block");
		      //querySelectorAll is the new, easy, strong selector than jQuery
		      var elements = document.querySelectorAll(':hover');
		      l = elements.length - 1;
		      var elementData = elements[l].__data__;
		      divTooltip.html("Date: " + elementData.data.date + "<br>"
		      	+ "Time: " + elementData.data.time + "<br>"
		      	+ "position: " + elementData.data.longitude + ", " + elementData.data.latitude + "<br>"
		      	+ "Magnitude: " + elementData.data.mag
		      	);
		    }).on("mouseout", function() {
		      divTooltip.style("display", "none");
		    })
				.transition().duration(750)
				.attr("r", "4px");
				
			// add eventlistener to li (2005 to 2015)
			d3.select('#article_menu').selectAll('li')
				.data([2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015])
				.enter().append('li')
				.attr('value', function(d) {return d;})
				.text((d) => {return d;})
				.on('click', function(d) {update(d);});

   		function update(selectCurYear) {
  			//console.log(data_sort[selectCurYear-1987].data);

  			//EXIT
      	svg.select(".event").selectAll("circle").data(data_sort[selectCurYear-2005].data.map((d) => {
  				//console.log(d);
  				return {
						"position": [d.longitude,d.latitude],
						"data": d
					};
  			})).exit()
      		.style("fill", "red")
      		.transition().duration(1500)
      		.attr("r", 1e-6)
      		.remove();

      	//UPDATE
      	svg.select(".event").selectAll("circle").data(data_sort[selectCurYear-2005].data.map((d) => {
  				//console.log(d);
  				return {
						"position": [d.longitude,d.latitude],
						"data": d
					};
  			}))
      		.transition().duration(1500)
      		.style("fill", "red")
      		.attr("r", "4px")
      		.attr("cx", (d) => { return projection(d.position)[0]; })
					.attr("cy", (d) => { return projection(d.position)[1]; });

				//ENTER
	      svg.select(".event").selectAll("circle").data(data_sort[selectCurYear-2005].data.map((d) => {
  				//console.log(d);
  				return {
						"position": [d.longitude,d.latitude],
						"data": d
					};
  			})).enter().append("circle")
		      .attr("r", 1e-6)
		      .style("fill", "red")
      		.attr("cx", (d) => { return projection(d.position)[0]; })
					.attr("cy", (d) => { return projection(d.position)[1]; })
		      .transition().duration(1500)
		      .attr("r", "4px");
		      

		    svg.select(".event").selectAll("circle")
		    	.on("mousemove", function(d){
				  //use d3.event.pageX, d3.event.pageY to detect the position of mouse in page
				  //and change the div position by these two attribute
				  divTooltip.style("left", d3.event.pageX+10+"px");
		      divTooltip.style("top", d3.event.pageY-25+"px");
		      divTooltip.style("display", "inline-block");
		      //querySelectorAll is the new, easy, strong selector than jQuery
		      var elements = document.querySelectorAll(':hover');
		      l = elements.length - 1;
		      var elementData = elements[l].__data__;
		      divTooltip.html("Date: " + elementData.data.date + "<br>"
		      	+ "Time: " + elementData.data.time + "<br>"
		      	+ "position: " + elementData.data.longitude + ", " + elementData.data.latitude + "<br>"
		      	+ "Magnitude: " + elementData.data.mag
		      	);
		    }).on("mouseout", function() {
		      divTooltip.style("display", "none");
		    });

  		}

  	});

 }
