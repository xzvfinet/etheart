function circularHeatChart() {
	var margin = { top: 0, right: 0, bottom: 0, left: 0 },
		innerRadius = 50,
		segmentHeight = 20,
		domain = [0, 10],
		range = ["black", "#00008B"],
		randomPos = [],
		maxValue = 100,
		maxTime = 2000,

		accessor = function(d) { return d; };

	function chart(selection) {
		selection.each(function(data) {
			var svg = d3.select(this);

			var offset = innerRadius + 10 * segmentHeight;


			// enter and update
			var g = svg.append("g").data([data])
				.classed("circular-heat", true)
				.attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")")

			var autoDomain = false;
			if (domain === null) {
				domain = d3.extent(data, accessor);
				autoDomain = true;
			}

			var color = d3.scaleLinear().domain(domain).range(range);
			if (autoDomain)
				domain = null;

			randomPos = d3.range(data.length).map(function() {
				return 2 * Math.PI * Math.random();
			});

			var path = g.selectAll("path").data(data);
			path.enter().append("path")
				.attr("d", d3.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
				.attr("fill", function(d) { return color(Math.random() * domain[1]); })
				.attr("fill-opacity", 0.5)
				.transition().ease(d3.easeLinear).duration(dur).remove()
				.attrTween("transform", rotTween(offset));
		});

	}

	/* Arc functions */
	ir = function(d, i) { // inner radius
		// return innerRadius + Math.floor(i / numSegments) * segmentHeight;
		return innerRadius + (d) * segmentHeight + 1;
	}
	or = function(d, i) { // outer radius
		// return innerRadius + segmentHeight + (i / numSegments) * segmentHeight;
		return innerRadius + (d) * segmentHeight + segmentHeight;
	}
	sa = function(d, i) { // start angle
		// return (i * 2 * Math.PI) / numSegments;
		return randomPos[i];
	}
	ea = function(d, i) { // end angle
		// return ((i + 1) * 2 * Math.PI) / numSegments;
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

	return chart;
}