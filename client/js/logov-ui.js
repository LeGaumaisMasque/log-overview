var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
        var el = $("<div></div>");
        if (d.tip) {
            el.text(d.tip);
            el.append("<br/>");
        }
        el.append("<i>" + (d.t[1] - d.t[0]) + "ms</i>");
        return el.html();
    });


function display(data, summary) {
    var barWidth = 20, barGap = 10;
    var margin = { top: 40, right: 30, bottom: 10, left: 60 };
    var width = summary.totalNbLevels * barWidth;
    var height = 500;
    var totalWidth = width + margin.left + margin.right;
    var totalHeight = height + margin.top + margin.bottom;

    ///////////////////////////////////////////////////////////////////////////////
    // Coordinates
    ///////////////////////////////////////////////////////////////////////////////

    var timeCoord = d3.time.scale()
        .domain([summary.firstTime, summary.lastTime])
        .range([0, height]).nice();

    var xCoord = d3.scale.ordinal()
        .domain(d3.range(summary.totalNbLevels))
        .rangeBands([0, summary.totalNbLevels * barWidth]);

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.5, 1000])
        .y(timeCoord)
        .on("zoom", zoomHandler);

    function zoomHandler() {
        container.select(".y-axis").call(timeAxis);
        barContainer.attr("transform", "translate(0," + d3.event.translate[1] + ") scale(1," + d3.event.scale + ")");
    }


    ///////////////////////////////////////////////////////////////////////////////
    // SVG
    ///////////////////////////////////////////////////////////////////////////////

    var svg = d3.select("#log-overview")
        .attr("width", totalWidth)
        .attr("height", totalHeight);

    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("class", "background");

    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "logov-clip")
        .append("svg:rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", width)
        .attr("height", height);

    var container = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Area on the right of the vertical axis
    var barArea = container.append("g")
        .attr("width", width)
        .attr("height", height)
        .attr("clip-path", "url(#logov-clip)")
        .call(zoom);

    barArea.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "log-background");

    // Contains bars. Changes size with zoom.
    var barContainer = barArea.append("g")
        .call(tip);

    barContainer.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bar-background");


    var minBarHeight = 0.01;

    var barContainerColumn = barContainer.selectAll("g").data(data.intervals).enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(" + xCoord(summary.nbSumLevels[i]) + ",0)"; });

    barContainerColumn.selectAll("rect").data(function(d,i) { return d.data; }).enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return xCoord(d.level); })
        .attr("y", function(d, i) { return timeCoord(d.t[0]); })
        .attr("height", function(d) { return Math.max(timeCoord(d.t[1]) - timeCoord(d.t[0]), minBarHeight); })
        .attr("width", barWidth - barGap)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);


    ///////////////////////////////////////////////////////////////////////////////
    // Time axis
    ///////////////////////////////////////////////////////////////////////////////

    var timeAxis = d3.svg.axis()
        .scale(timeCoord)
        .orient("left");

    container.append("g")
        .attr("class", "y-axis axis")
        .call(timeAxis);


    ///////////////////////////////////////////////////////////////////////////////
    // Label and vertical lines for each intervals
    ///////////////////////////////////////////////////////////////////////////////

    var heading = svg.append("g")
        .attr('class', 'heading')
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

    heading.selectAll("text").data(data.intervals).enter()
        .append("text")
        .attr("y", 2*margin.top/3)
        .attr("x", function(d, i) { return xCoord(summary.nbSumLevels[i]) + barGap/2; })
        .text(function(d) { return d.name; })

    heading.selectAll("line").data(data.intervals.slice(0,-1)).enter()
        .append("line")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
        .attr("y1", 0)
        .attr("x1", function(d, i) { return xCoord(summary.nbSumLevels[i+1]) - barGap/2; })
        .attr("y2", totalHeight)
        .attr("x2", function(d, i) { return xCoord(summary.nbSumLevels[i+1]) - barGap/2; })
}