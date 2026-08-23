/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9324, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9, 500, 1500, "Products"], "isController": false}, {"data": [1.0, 500, 1500, "Formulas-0"], "isController": false}, {"data": [1.0, 500, 1500, "Formulas-1"], "isController": false}, {"data": [0.87, 500, 1500, "Formulas"], "isController": false}, {"data": [0.6, 500, 1500, "Charts"], "isController": false}, {"data": [0.9, 500, 1500, "UnitConversions-1"], "isController": false}, {"data": [0.9, 500, 1500, "UnitConversions-0"], "isController": false}, {"data": [1.0, 500, 1500, "Cart"], "isController": false}, {"data": [0.97, 500, 1500, "Charts-1"], "isController": false}, {"data": [1.0, 500, 1500, "GetStarted"], "isController": false}, {"data": [1.0, 500, 1500, "Charts-0"], "isController": false}, {"data": [0.58, 500, 1500, "Calculators"], "isController": false}, {"data": [1.0, 500, 1500, "API_List"], "isController": false}, {"data": [1.0, 500, 1500, "ReleaseNotes"], "isController": false}, {"data": [0.94, 500, 1500, "Currencies"], "isController": false}, {"data": [1.0, 500, 1500, "Currencies-0"], "isController": false}, {"data": [1.0, 500, 1500, "Contact"], "isController": false}, {"data": [1.0, 500, 1500, "Currencies-1"], "isController": false}, {"data": [0.76, 500, 1500, "UnitConversions"], "isController": false}, {"data": [1.0, 500, 1500, "TestCases"], "isController": false}, {"data": [1.0, 500, 1500, "Calculators-0"], "isController": false}, {"data": [0.94, 500, 1500, "Calculators-1"], "isController": false}, {"data": [0.95, 500, 1500, "Downloads"], "isController": false}, {"data": [1.0, 500, 1500, "UserManual"], "isController": false}, {"data": [1.0, 500, 1500, "BestPractices"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 0, 0.0, 321.3231999999999, 3, 1807, 249.0, 703.9000000000001, 739.0, 1238.8600000000001, 76.17306520414381, 2027.6995615287933, 12.238274108775137], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Products", 50, 0, 0.0, 447.73999999999995, 263, 1335, 281.0, 1133.0, 1238.3, 1335.0, 7.0116393212733135, 335.1193841151311, 0.8764549151591642], "isController": false}, {"data": ["Formulas-0", 50, 0, 0.0, 243.50000000000006, 231, 266, 243.5, 253.9, 260.9, 266.0, 4.068679306697046, 1.509861461469607, 0.5363981507852551], "isController": false}, {"data": ["Formulas-1", 50, 0, 0.0, 268.9399999999999, 233, 499, 247.5, 445.89999999999975, 467.9, 499.0, 4.003843689942345, 97.45292981262011, 0.5434905008808456], "isController": false}, {"data": ["Formulas", 50, 0, 0.0, 512.7800000000002, 470, 732, 493.0, 685.8999999999997, 711.0, 732.0, 3.930199654142431, 97.11891801603522, 1.05163545433108], "isController": false}, {"data": ["Charts", 50, 0, 0.0, 670.76, 472, 757, 720.5, 744.9, 747.0, 757.0, 3.8642862663266095, 125.29495372517196, 1.0566407759486822], "isController": false}, {"data": ["UnitConversions-1", 50, 0, 0.0, 409.9200000000001, 233, 1025, 248.0, 989.7, 997.9, 1025.0, 3.8226299694189603, 90.5410813264526, 0.5450234136085627], "isController": false}, {"data": ["UnitConversions-0", 50, 0, 0.0, 343.9599999999998, 231, 813, 246.0, 751.7, 758.5999999999999, 813.0, 3.680800942285041, 1.3910839498674912, 0.5104235681684335], "isController": false}, {"data": ["Cart", 50, 0, 0.0, 264.7, 237, 379, 250.5, 335.59999999999997, 372.0, 379.0, 8.183306055646481, 66.10704787234042, 1.0309047667757774], "isController": false}, {"data": ["Charts-1", 50, 0, 0.0, 428.2800000000001, 233, 506, 483.0, 500.0, 501.45, 506.0, 3.9354584809130264, 126.13067566902794, 0.5457374065328611], "isController": false}, {"data": ["GetStarted", 50, 0, 0.0, 34.780000000000015, 5, 392, 11.0, 65.19999999999999, 274.1999999999994, 392.0, 19.75503753457132, 1965.4448896187278, 2.7394680956143813], "isController": false}, {"data": ["Charts-0", 50, 0, 0.0, 242.24000000000007, 231, 261, 243.0, 252.0, 253.35, 261.0, 4.009301579664822, 1.4995727588004168, 0.540316033197017], "isController": false}, {"data": ["Calculators", 50, 0, 0.0, 682.8799999999999, 474, 809, 723.0, 748.9, 756.8, 809.0, 3.79794910748196, 180.387746866692, 0.94948727687049], "isController": false}, {"data": ["API_List", 50, 0, 0.0, 252.3, 238, 371, 249.5, 259.9, 278.19999999999993, 371.0, 8.280887711162636, 166.47366160152367, 1.0351109638953295], "isController": false}, {"data": ["ReleaseNotes", 50, 0, 0.0, 7.52, 3, 19, 6.0, 13.899999999999999, 15.449999999999996, 19.0, 22.789425706472194, 718.8995556061988, 2.826422914767548], "isController": false}, {"data": ["Currencies", 50, 0, 0.0, 486.92, 470, 504, 486.0, 501.0, 502.45, 504.0, 3.927729772191673, 84.200706991359, 1.1276880400628437], "isController": false}, {"data": ["Currencies-0", 50, 0, 0.0, 242.5, 231, 264, 243.0, 252.9, 256.15, 264.0, 4.002241255102858, 1.5242911030176898, 0.5667236152245257], "isController": false}, {"data": ["Contact", 50, 0, 0.0, 262.4, 233, 379, 251.0, 330.4, 363.94999999999993, 379.0, 8.28775070445881, 80.3885919111553, 1.0521558511519973], "isController": false}, {"data": ["Currencies-1", 50, 0, 0.0, 244.14, 233, 268, 244.0, 252.8, 254.0, 268.0, 4.000960230455309, 84.24678172761463, 0.5821709710330479], "isController": false}, {"data": ["UnitConversions", 50, 0, 0.0, 754.24, 471, 1807, 493.0, 1741.1, 1756.95, 1807.0, 3.61794500723589, 87.06033488603472, 1.017547033285094], "isController": false}, {"data": ["TestCases", 50, 0, 0.0, 261.2199999999999, 240, 357, 252.5, 296.6, 315.9, 357.0, 8.177952240758913, 349.5732770076873, 1.0382165930650966], "isController": false}, {"data": ["Calculators-0", 50, 0, 0.0, 244.02, 231, 301, 244.0, 251.9, 254.35, 301.0, 3.9373178990471693, 1.4265087310024411, 0.48447466335931966], "isController": false}, {"data": ["Calculators-1", 50, 0, 0.0, 438.66, 234, 513, 484.0, 501.0, 505.25, 513.0, 3.868172675228222, 182.32163493153334, 0.49107660915983287], "isController": false}, {"data": ["Downloads", 50, 0, 0.0, 273.70000000000005, 193, 668, 225.0, 580.5999999999999, 619.6999999999999, 668.0, 20.85940759282436, 384.76725464121824, 2.729649040467251], "isController": false}, {"data": ["UserManual", 50, 0, 0.0, 8.000000000000002, 4, 24, 7.0, 12.899999999999999, 18.24999999999998, 24.0, 22.862368541380885, 1051.8917716906722, 3.036408321902149], "isController": false}, {"data": ["BestPractices", 50, 0, 0.0, 6.9799999999999995, 3, 17, 6.0, 13.0, 14.449999999999996, 17.0, 22.93577981651376, 947.5648652522935, 3.2477422591743115], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
