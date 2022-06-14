			//
// Graph utility functions
//
var Util = {
  format_integer: function(number) {
    var int = parseInt("0" + number, 10);
    return String(int).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

//
// Donut Graph
//

var DonutGraph = function(el, series, opts) {
  opts || (opts = {});

  this.el = d3.select(el);

  this.size = opts.size || parseInt(this.el.style('width'), 10);
  this.radius = this.size / 2;
  this.thickness = opts.thickness || Math.round(this.radius / 15);

  this.value = opts.value;
  this.value_text = typeof(opts.value_text) === "undefined" ? Util.format_integer(this.value) : opts.value_text;
  this.value_color = opts.value_color;

  this.label = opts.label;
  this.label_position = opts.label_position || 'center';
  this.label_color = opts.label_color;
  
  this.label_subtext = opts.label_subtext;
  
  this.color = opts.color || 'gray';
  this.total = opts.total;
  this.series = series;
  
  if (!this.series || !(this.series && this.series.length)) {
    this.series = [{ value: this.value, color: this.color }];
  }

  this.class_name = opts.class_name;
};

DonutGraph.prototype.draw = function() {
  var pie = d3.layout.pie().sort(null).startAngle(0).value(function(d){ return d.value; })
  ,   series = this.series
  ,   total = this.total
  ,   innerRadius = this.radius - this.thickness
  ,   outerRadius = this.radius
  ,   arc = function() { return d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius) }
  ,   sum = 0
  ,   value
  ,   label
  ;
  
  for (var i = 0; i < series.length; i++) {
    sum += series[i].value;
  }
  
  if (this.total) {
    pie.endAngle(2.0 * Math.PI * sum / total);
  } else {
    total = sum;
  }
  
  this.el
    .classed('donut-graph', true)
    .style('width', this.size + 'px')
    .style('height', this.size + 'px');

  if (this.class_name) { this.el.classed(this.class_name, true); }

  var graph = this.el.append('div')
    .style('position', 'relative')
    .style('width', this.size + 'px')
    .style('height', this.size + 'px');

  var svg = graph
    .append('svg:svg')
    .attr('width', this.size)
    .attr('height', this.size);

  var background = svg.append('svg:path')
    .classed('donut-graph-background', true)
    .attr('fill', '#e5e5e5')
    .attr('transform', 'translate(' + this.radius + ',' + this.radius + ')')
    .attr('d', arc().startAngle(0).endAngle(2*Math.PI)());
    
  var arcs = svg
    .append('svg:g')
    .selectAll('.donut-graph-arc')
    .data(pie(this.series))
    .enter()
      .append('svg:path')
        .classed('donut-graph-arc', true)
        .attr('transform', 'translate(' + this.radius + ',' + this.radius + ')')
        .attr('fill', function(d, i) { return d.data.color; })
        .attr('d', arc());
  
  if (this.label && this.label_position === 'center') {
    
    var label_group = graph.append("div")
      .style("position", "absolute")
      .style("display", "table")
      .style("top", this.thickness + "px")
      .style("left", this.thickness + "px")
      .style("width", this.size - (this.thickness * 2) + "px")
      .style("height", this.size - (this.thickness * 2) + "px");

    var label_group_inner = label_group.append("div")
      .style("display", "table-cell")
      .style("text-align", "center")
      .style("vertical-align", "middle");

    value = label_group_inner.append("div")
      .classed('donut-graph-value', true)
      .text(this.value_text);
    
    label = label_group_inner.append("div")
      .classed("donut-graph-label", true)
      .style("text-align", "center")
      .text(this.label);
    
  } else {
    
    value = graph.append('div')
      .classed("donut-graph-value", true)
      .style("white-space", "nowrap")
      .style("overflow", "visible")
      .style("display", "inline-block")
      .text(this.value_text);
    
    var value_rect = {
      width: parseInt(value.style('width'), 10),
      height: parseInt(value.style('height'), 10)
    };
    
    value
      .style('position', 'absolute')
      .style('left', ((this.size - value_rect.width) / 2) + 'px')
      .style('top', ((this.size - value_rect.height) / 2) + 'px');

    if (this.label) {
      var width = this.size;
      
      label = graph.append('div')
        .classed("donut-graph-label", true)
        .style("white-space", "nowrap")
        .style("overflow", "visible")
        .style("display", "inline-block")
        .text(this.label);
      
      if (this.label_subtext) {
        label.node().appendChild(document.createTextNode(" "));
        
        var subtext = label.append('span')
          .classed("donut-graph-label-subtext", true)
          .text(this.label_subtext);
      }
      
      var label_rect = {
        width: parseInt(label.style('width'), 10),
        height: parseInt(label.style('height'), 10)
      };
      var space = (label_rect.height / 2);

      label
        .style('position', 'absolute')
        .style('left', this.size + space + 'px')
        .style('top', ((this.size - label_rect.height) / 2) + 'px');

      width += space + label_rect.width; 
      
      svg.attr('width', width + 'px');
      this.el.style('width', width + 'px');
    }
    
    if (value && this.value_color) {
      value.style('color', this.value_color);
    }
    if (label && this.label_color) {
      label.style('color', this.label_color);
    }

  }

};

	var graph1 = new DonutGraph('#performace_1', [
		{value: 80,  color: "#558b2f" },
		{value: 20, color: "#f62d51" }
	], {
		class_name: 'large',
		value: 80,
		label: "% satisfaction score",
		size: 150
	});
	var graph2 = new DonutGraph('#performace_2', [
		{value: 90,  color: "#558b2f" },
		{value: 10, color: "#f62d51" }
	], {
		class_name: 'large',
		value: 90,
		label: "% satisfaction score",
		size: 150
	});
	var graph3 = new DonutGraph('#performace_3', [
		{value: 88,  color: "#558b2f" },
		{value: 12, color: "#f62d51" }
	], {
		class_name: 'large',
		value: 88,
		label: "% satisfaction score",
		size: 150
	});
	var graph4 = new DonutGraph('#performace_4', [
		{value: 95,  color: "#558b2f" },
		{value: 5, color: "#f62d51" }
	], {
		class_name: 'large',
		value: 95,
		label: "% satisfaction score",
		size: 150
	});
	var graph5 = new DonutGraph('#performace_5', [
		{value: 78,  color: "#558b2f" },
		{value: 22, color: "#f62d51" }
	], {
		class_name: 'large',
		value: 78,
		label: "% satisfaction score",
		size: 150
	});
graph1.draw();
graph2.draw();
graph3.draw();
graph4.draw();
graph5.draw();