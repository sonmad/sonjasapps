var colors = ["#c00000", "#081ff9", "#8f0ac6", "#067e36", "#0ac632", "#f9fa99", "#f0ac19", "#fc0303", "#0ba79a", "#f444c9", "#190558", "#d2c4cf", "#d50da4", "#f8f010", "#d6d7ee", "#06666c", "#e9a0fe", "#a0a3fe", "#a0edfe", "#fea0e2", "#a0fefd", "#b6fea0", "#6e7169", "#f56c08", "#838b2c", "#2c8b6f", "#d01c53", "#d074eb", "#9674eb"];

var chart = (function () {
    var startDonut = function () {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawDonutChart);
    };
    var startBar = function () {
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawBarChart);
    };
    var drawDonutChart = function () {
        var customSize = App.cache.psize;
        var CustomColors = util.getProperty("CColors");
        if (CustomColors !== undefined) {
            var cc = CustomColors.split(',');
            for (e = 0; e < cc.length; e++) {
                colors[e] = cc[e].trim();
            }
        }
        var result = App.cache.result;

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Answer');
        data.addColumn('number', 'Answers');
        for (u = 0; u < result.length; u++) {
            var qChoice = result[u].split('|'); var qTextL = result[u].split('|');
            var qText = qTextL[0]; var qValue = parseInt(qChoice[1]);
            data.addRows([
                [qText, qValue]
            ]);
        }
    var options = {
        title: App.cache.qpQ,
        pieHole: 0.4,
        width: customSize,
        height: customSize,
        colors:colors
    };

    var chart = new google.visualization.PieChart(document.getElementById("qpCanvas"));
    chart.draw(data, options);
    util.resize();
    };
    var drawBarChart = function () {
        var customSize = App.cache.psize;
        var CustomColors = util.getProperty("CColors");
        if (CustomColors !== undefined) {
            var cc = CustomColors.split(',');
            for (e = 0; e < cc.length; e++) {
                colors[e] = cc[e].trim();
            }
        }
        var result = App.cache.result;
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Answer');
        data.addColumn('number', 'Answers');
        data.addColumn({ type: 'string', role: 'color' })
        for (u = 0; u < result.length; u++) {
            var color =  colors[u];
            if (colors[u] === null || colors[u]===undefined) { color = "#c00000"; }
            var qChoice = result[u].split('|'); var qTextL = result[u].split('|');
            var qText = qTextL[0]; var qValue = parseInt(qChoice[1]);
            data.addRows([
                [qText, qValue, color]
            ]);
        }
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
                         {
                             calc: "stringify",
                             sourceColumn: 1,
                             type: "string",
                             role: "annotation"
                         },
                         2]);
        var options = {
            title: App.cache.qpQ,
            width: customSize,
            height: customSize,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
        };
        var chart = new google.visualization.BarChart(document.getElementById("qpCanvas"));
        chart.draw(view, options);
        util.resize();
    };
    return {
        loadDonut: startDonut,
        loadBar: startBar
    };
})();

