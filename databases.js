var expression = "servers.???-db-*.load.load.shortterm";

var context = cubism.context()
        .serverDelay(0)
        .clientDelay(0)
        .step(5e4)
        .size(300);

var graphite = context.graphite("http://graphite.spoutlets.com");

graphite.find(expression, function(error, results) {
    var metrics = results.map(function(d) {
        return graphite.metric(d).summarize("avg").alias(d.substring(8,16));
    });

    d3.select(".databases").call(function(div) {
        div.select(".database").call(context.axis().orient("top").ticks(d3.time.minutes, 60));
        div.select(".database").selectAll(".horizon")
            .data(metrics)
            .enter().append("div")
            .attr("class", "horizon")
            .call(context.horizon().height(30));
    });

    context.on("focus", function(i) {
        d3.selectAll(".value").style("right", i == null ? null : context.size() - 1 - i + "px");
    });
});
