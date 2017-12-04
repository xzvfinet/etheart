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
		accessor = function(d) { return d; },
		dataScale = function(d) { return d; };

	function chart(selection) {
		selection.each(function(data) {
			var svg = d3.select(this);

			dataScale = d3.scaleLinear().domain(domain).range(range);
			data = data.map(x => Math.min(range[1], Math.round(dataScale(accessor(x)))));

			if (offset == null) {
				offset = innerRadius + range[1] * segmentHeight;
			}

			var translate = "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")";

			// color
			var color = d3.scaleLinear().domain(range).range(colorRange);
			randomPos = d3.range(data.length).map(x => 2 * Math.PI * Math.random());

			// background
			var numberArray = Array.apply(null, { length: range[1] }).map(Number.call, Number);
			svg.selectAll('g.background').data([0])
				.enter().append("g")
				.attr('class', 'background')
				.attr('transform', translate)
				.selectAll('path').data(numberArray).enter().append("path")
				.attr("class", "back")
				.attr("d", d3.arc().innerRadius(ir).outerRadius(or).startAngle(0).endAngle(2 * Math.PI))
				.attr("fill", "black")
				.attr("fill-opacity", "0.05");

			// foreground
			var gForeground = svg.selectAll('g.foreground').data([data]);
			gForeground.enter().append("g")
				.merge(gForeground)
				.attr('class', 'foreground')
				.attr('transform', translate);

			var gContents = gForeground.selectAll("g.content").data(numberArray);
			gContents.enter().append("g")
				.merge(gContents)
				.attr('class', 'content');

			gForeground.selectAll("g.content").each(function(d, i) {
				d3.select(this)
					.selectAll('path').data(data.filter(x => x == d))
					.enter().append('path')
					.attr("class", "fore")
					.attr("d", d3.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
					.attr("fill", function(d) { return color(d); })
					.attr("fill-opacity", 0.5)
					.transition().ease(d3.easeLinear).duration(dur).remove()
					.attrTween("transform", rotTween(offset));
			});
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
		return function(d) {
			var i = d3.interpolate(0, 720);
			return function(t) {
				return "rotate(" + i(t) + ")";
			};
		};
	}

	scaleTween = function(offset) {
		return function(d) {
			var i = d3.interpolate(1.0, 1.1);
			return function(t) {
				return "scale(" + i(t) + ")";
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


	return chart;
}