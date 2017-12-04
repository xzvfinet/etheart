var width = 800;
var height = 600;

var bidColor = "#00008B";
var askColor = "#8b0000";

// configurations
var chart = circularHeatChart()
	.margin({ top: 30, right: 0, bottom: 0, left: 30 })
	.innerRadius(70)
	.segmentHeight(20)
	.border(2)
	.domain([546, 12000000])
	.range([1, 10])
	.N(18)
	.accessor(totalAccessor);

var svg = d3.select('.chart').insert('svg');

function prefetch() {
	$.getJSON('https://api.bithumb.com/public/recent_transactions/ETH', {
		count: 100,
		// offset: 10000
	}, drawChart);
}
prefetch();

var t = new Transaction();

function drawChart(data) {
	if (data !== null) {
		let filtered = data.data;

		// filtering by string comparison
		let prev = t.findInArray(data.data);
		if (prev != -1) {
			filtered = filtered.slice(0, prev);
		}

		console.log(filtered.length, t.transaction_date, t.total);
		if (filtered.length == 0) {
			// no transactions to update
			setTimeout(prefetch, 300);
			return;
		}

		// parse change to number
		filtered.map(x => x.total = Number(x.total));

		// variables
		let bid = filtered.filter(x => x.type == 'bid');
		let ask = filtered.filter(x => x.type == 'ask');

		// arc
		svg.data([bid])
			.attr("width", width)
			.attr("height", height)
			// .attr("viewBox", "0 0 1024 800")
			.call(chart.colorRange(["black", bidColor]));
		svg.data([ask])
			.attr("width", width)
			.attr("height", height)
			// .attr("viewBox", "0 0 1024 800")
			.call(chart.colorRange(["black", askColor]));

		// text
		bidMinMax = [d3.min(bid, priceAccessor), d3.max(bid, priceAccessor)];
		askMinMax = [d3.min(ask, priceAccessor), d3.max(ask, priceAccessor)];
		bidMin = bidMinMax[0];
		askMax = askMinMax[1];

		var priceText = svg.selectAll('text.bid').data([bidMin, askMax]);
		priceText.enter().append('text').merge(priceText)
			.attr('class', 'bid').text(function(d) { return d; })
			.attr('transform', function(d, i) { return 'translate(' + (chart.margin().left + chart.offset()) + "," + (chart.margin().top + chart.offset() + i * 27) + ")"; })
			.attr('fill', (d, i) => (i == 0) ? bidColor : askColor)
			.attr('text-anchor', 'middle')
			.attr('font-weight', 900)
			.attr('font-size', 35);
	}

	setTimeout(prefetch, 300);
}

function totalAccessor(data) {
	return data.total;
}

function priceAccessor(data) {
	return data.price;
}