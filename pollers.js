var expression = "servers.???-spo-poll-*.load.load.shortterm";

var context = cubism.context()
        .serverDelay(0)
        .clientDelay(0)
        .step(5e4)
        .size(300);

var graphite = context.graphite("http://graphite.spoutlets.com");

graphite.find(expression, function(error, results) {
    var metrics = results.map(function(d) {
        return graphite.metric(d).summarize("avg").alias(d.substring(8,21));
    });

    d3.select(".pollers").call(function(div) {
        div.select(".poller").call(context.axis().orient("top").ticks(d3.time.minutes, 60));
        div.select(".poller").selectAll(".horizon")
            .data(metrics)
            .enter().append("div")
            .attr("class", "horizon")
            .call(context.horizon().height(30));
    });
});
