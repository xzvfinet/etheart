function circularHeatChart() {
	var margin = { top: 0, right: 0, bottom: 0, left: 0 },
		border = 1,
		innerRadius = 20,
		segmentHeight = 20,
		domain = [0, 10],
		range = [0, 10],
		colorRange = ["black", "#00008B"],
		randomPos = [],
		maxValue = 100,
		maxTime = 2000,
		offset = null,
		N = 25,
		accessor = function(d) { return d; },
		dataScale = function(d) { return d; };

	function chart(selection) {
		selection.each(function(data) {
			var svg = d3.select(this);

			dataScale = d3.scaleLinear().domain(domain).range(range);
			data = data.map(x => Math.round(dataScale(accessor(x))));

			if (offset == null) {
				offset = innerRadius + N * segmentHeight;
			}

			var numberArray = Array.apply(null, { length: N }).map(Number.call, Number);
			var g = svg.selectAll('g.background').data([0]);
			g.enter().append("g")
				.attr('class', 'background')
				.attr('transform', "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")")
				.selectAll('path').data(numberArray).enter().append("path")
				.attr("d", d3.arc().innerRadius(ir).outerRadius(or).startAngle(0).endAngle(2 * Math.PI))
				.attr("fill", "black")
				.attr("fill-opacity", "0.05");


			// group
			var g = svg.selectAll('g.foreground') //.filter(x => console.log(x));
			g.data([data])
				.enter()
				.append("g")
				.attr('class', 'foreground')

			// color
			var color = d3.scaleLinear().domain(range).range(colorRange);
			randomPos = d3.range(data.length).map(x => 2 * Math.PI * Math.random());

			// arc
			var path = g.selectAll("path").data(data)
				.enter().append("path")
				.attr("d", d3.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
				.attr("fill", function(d) { return color(d); })
				.attr("fill-opacity", 0.5)
				.transition().ease(d3.easeLinear).duration(dur).remove()
				.attrTween("transform", rotTween(offset));
		});
	}

	/* Arc functions */
	ir = function(d, i) { // inner radius
		return innerRadius + d * segmentHeight + border;
	}
	or = function(d, i) { // outer radius
		return innerRadius + d * segmentHeight + segmentHeight;
	}
	sa = function(d, i) { // start angle
		return randomPos[i];
	}
	ea = function(d, i) { // end angle
		return randomPos[i] + (d / maxValue) * 2 * Math.PI;
	}
	dur = function(d, i) {
		return Math.log(d / maxValue * maxTime) * 1000;
	}

	rotTween = function(offset) {
		var i = d3.interpolate(0, 720);
		return function(d) {
			return function(t) {
				return "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")" +
					"rotate(" + i(t) + ")";
			};
		};
	}

	/* Configuration getters/setters */
	chart.margin = function(_) {
		if (!arguments.length) return margin;
		margin = _;
		return chart;
	};

	chart.border = function(_) {
		if (!arguments.length) return border;
		border = _;
		return chart;
	};

	chart.innerRadius = function(_) {
		if (!arguments.length) return innerRadius;
		innerRadius = _;
		return chart;
	};

	chart.segmentHeight = function(_) {
		if (!arguments.length) return segmentHeight;
		segmentHeight = _;
		return chart;
	};

	chart.domain = function(_) {
		if (!arguments.length) return domain;
		domain = _;
		return chart;
	};

	chart.range = function(_) {
		if (!arguments.length) return range;
		range = _;
		return chart;
	};

	chart.colorRange = function(_) {
		if (!arguments.length) return colorRange;
		colorRange = _;
		return chart;
	};

	chart.accessor = function(_) {
		if (!arguments.length) return accessor;
		accessor = _;
		return chart;
	};

	chart.offset = function(_) {
		if (!arguments.length) return offset;
		offset = _;
		return chart;
	}

	chart.N = function(_) {
		if (!arguments.length) return N;
		N = _;
		return chart;
	}


	return chart;
}