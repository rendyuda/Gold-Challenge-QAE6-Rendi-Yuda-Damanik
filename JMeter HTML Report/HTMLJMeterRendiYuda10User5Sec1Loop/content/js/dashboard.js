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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8333333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Seller Product id"], "isController": false}, {"data": [0.75, 500, 1500, "POST Register (Buyer)"], "isController": false}, {"data": [1.0, 500, 1500, "POST Login (Buyer)"], "isController": false}, {"data": [0.15, 500, 1500, "POST Login (Seller)"], "isController": false}, {"data": [0.35, 500, 1500, "POST Register (Seller)"], "isController": false}, {"data": [0.5, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [0.85, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [1.0, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product id"], "isController": false}, {"data": [0.95, 500, 1500, "GET Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Buyer Order id"], "isController": false}, {"data": [0.95, 500, 1500, "DELETE Buyer Order id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 150, 0, 0.0, 630.7466666666664, 287, 3655, 391.0, 1510.9, 1969.499999999996, 3610.630000000001, 10.820949357957003, 7.730356595368634, 3.819738764247583], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Seller Product id", 10, 0, 0.0, 370.5, 309, 450, 372.0, 448.3, 450.0, 450.0, 2.8620492272467084, 2.0598928520320547, 1.6741869991413851], "isController": false}, {"data": ["POST Register (Buyer)", 10, 0, 0.0, 598.7, 357, 1501, 438.0, 1449.3000000000002, 1501.0, 1501.0, 2.852253280091272, 1.635031909583571, 0.0], "isController": false}, {"data": ["POST Login (Buyer)", 10, 0, 0.0, 424.5, 357, 496, 441.0, 491.8, 496.0, 496.0, 2.8677946659019216, 1.4170938485804416, 1.8931925724118153], "isController": false}, {"data": ["POST Login (Seller)", 10, 0, 0.0, 1632.9, 1252, 2749, 1521.5, 2690.3, 2749.0, 2749.0, 2.2904260192395784, 1.1295558005038937, 0.9215385936784243], "isController": false}, {"data": ["POST Register (Seller)", 10, 0, 0.0, 1811.3000000000002, 359, 3655, 1477.0, 3646.3, 3655.0, 3655.0, 2.058036633052068, 1.1616652088907182, 0.0], "isController": false}, {"data": ["POST Seller Product", 10, 0, 0.0, 1044.1, 324, 2219, 891.5, 2178.3, 2219.0, 2219.0, 2.403846153846154, 1.6385591947115383, 0.0], "isController": false}, {"data": ["GET Buyer Product", 10, 0, 0.0, 600.7, 357, 1321, 428.5, 1319.0, 1321.0, 1321.0, 2.940311673037342, 3.3394360114672157, 0.0], "isController": false}, {"data": ["POST Buyer Order", 10, 0, 0.0, 367.40000000000003, 307, 437, 375.5, 433.3, 437.0, 437.0, 3.57653791130186, 2.4239426859799718, 2.3226540146638057], "isController": false}, {"data": ["GET Buyer Order", 10, 0, 0.0, 356.1, 291, 411, 372.0, 410.6, 411.0, 411.0, 3.5161744022503516, 4.213228507383967, 2.0259207981715894], "isController": false}, {"data": ["GET Buyer Product id", 10, 0, 0.0, 316.79999999999995, 287, 358, 302.5, 357.3, 358.0, 358.0, 3.746721618583739, 3.5564584113900337, 0.0], "isController": false}, {"data": ["GET Buyer Order id", 10, 0, 0.0, 438.00000000000006, 305, 917, 387.0, 869.0000000000002, 917.0, 917.0, 3.244646333549643, 3.881534920506165, 1.8884855613238158], "isController": false}, {"data": ["DELETE Seller Product id", 10, 0, 0.0, 355.19999999999993, 294, 397, 385.0, 396.6, 397.0, 397.0, 2.7495188342040144, 0.8645947896618091, 1.667432808633489], "isController": false}, {"data": ["GET Seller Product", 10, 0, 0.0, 338.29999999999995, 303, 396, 332.0, 393.8, 396.0, 396.0, 2.987750224081267, 2.1561986480430235, 0.0], "isController": false}, {"data": ["PUT Buyer Order id", 10, 0, 0.0, 374.3, 301, 451, 381.5, 449.6, 451.0, 451.0, 3.247807729782397, 2.188464192919779, 2.045738267294576], "isController": false}, {"data": ["DELETE Buyer Order id", 10, 0, 0.0, 432.40000000000003, 305, 997, 387.0, 938.4000000000002, 997.0, 997.0, 2.7472527472527473, 0.8853451236263736, 1.6580099587912087], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 150, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
