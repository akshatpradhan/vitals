// Create a top-level Cubism Context
var context = cubism.context()
        .serverDelay(0)
        .clientDelay(0)
        .step(6e5)
        .size(620);

var graphite = context.graphite("http://graphite.spoutlets.com");

// Add metric expressions in this array for now
var metrics = [
    graphite.metric("sumSeries(stats.spoutlets.production.controllers.Entry.create.status_code.200.*)").summarize("avg").alias(" Rate" + " of" + " Entry#create "),
    graphite.metric("averageSeries(stats.timers.spoutlets.production.controllers.Entry.create.duration.*.mean_90)").summarize("avg").alias(" Latency" + " of" + " Entry#create "),
    graphite.metric("averageSeries(stats.timers.spoutlets.production.auth_latency.???-spo-poll-?.mean_90)").summarize("avg").alias(" Latency" +" of" + " auths "),
    graphite.metric("nonNegativeDerivative(servers.spo-vpn1_domain_local.disk-sda.disk_time.write)").summarize("avg").alias(" Time" +" to" + " write" + " to" +  " disk ")
];

d3.select(".appMetrics").call(function(div) {
    div.select(".appMetric").call(context.axis().orient("top"));
    div.select(".appMetric").selectAll(".horizon")
        .data(metrics)
        .enter().append("div")
        .attr("class", "horizon")
        .call(context.horizon().height(30));
});
