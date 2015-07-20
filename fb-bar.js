var Chart = (function(){

	var params = {
		w : 960,
		h : 500,
		file : "interests_war_noun_phrases_unique.json",
	    // files : ['../data/data.tsv','../data/data-alt.tsv','../data/data.tsv',],
	    // index :0,    
	    selector : "#chart",
	    f : " "
	}

	var margin = {top: 20, right: 10, bottom: 30, left: 110},
	width = params.w - margin.left - margin.right,
	height = params.h - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	.range([height, 0]);

	var xAxis = d3.svg.axis()
	  .scale(x)
	  .orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");
	var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span style='fill:black;'>" + d.value + " people"+"</span>";
    });

	var chart;
	var phrases = [];
	var data = {};
	var currentSelection = {};
	// var loaded = False;

	function parser(json){
		var parsed = {}
			for (var d in json) {
				key = decodeURIComponent(d);
				values = json[d]
				interest = []
				if(values.length > 0){
					for (var v in values){
						thing = values[v]
						// console.log(thing["name"]+" "+thing["audience_size"]);
						interest.push({"name": thing["name"],"value":thing["audience_size"]})
					} 
					parsed[key] = interest;
				}
			}
			return parsed;
	}

	function getPhrases(){
		return phrases;
	}

	function updateGraph(newPhrase){
		// if(newPhrase in Object.keys(data)){
			currentSelection = data[newPhrase];	
			draw()
		// }
		// else{
			// console.log("Phrase not in data");
		// }
	}

	function init(cb){
		filename = "interests_war_noun_phrases_unique.json";
		
		d3.json(filename, function(error, json) {
			
			data = parser(json);
			phrases = Object.keys(data);
			currentSelection = data["violence"];
			// console.log(data);
			// console.log(currentSelection);
			// currentSelection = phrases[0];
			  draw();
			  cb(phrases);

		});
	

	}
	function draw(){
		d3.selectAll("svg").remove()
		chart = d3.select(params.selector)
			.append("svg")
		    .attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");				
		x.domain( currentSelection.map(function(d) { return d.name; }));
		y.domain([0, d3.max(currentSelection, function(d) { return d.value; })]);
		chart.call(tip);
		chart.append("g")
		  .attr("class", "x-axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		chart.append("g")
		  .attr("class", "y-axis")
		  .style("text-anchor", "end")
		  .call(yAxis);
		
		chart.selectAll(".bar")
			.data(currentSelection)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", function(d) {  return x(d.name); })
			.attr("y", function(d) { console.log(y(d.value)); return y(d.value); })
			.attr("height", function(d) {  return height - y(d.value); })
			.attr("width", x.rangeBand())
		  .on('mouseover', tip.show)
		  .on('mouseout', tip.hide);
	}

	return {
      init:init,
      draw:draw,
      updateGraph:updateGraph,
      getPhrases:getPhrases
    }
	
});