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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "POST Register (Buyer)"], "isController": false}, {"data": [1.0, 500, 1500, "POST Login (Buyer)"], "isController": false}, {"data": [0.4375, 500, 1500, "POST Login (Seller)"], "isController": false}, {"data": [0.5625, 500, 1500, "POST Register (Seller)"], "isController": false}, {"data": [0.375, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [1.0, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order id"], "isController": false}, {"data": [0.9375, 500, 1500, "DELETE Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Buyer Order id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 120, 0, 0.0, 518.1333333333336, 270, 2936, 361.5, 1175.5, 1515.5999999999997, 2801.809999999995, 10.186757215619695, 7.277297325976232, 3.5958722410865875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Seller Product id", 8, 0, 0.0, 337.75, 287, 397, 339.0, 397.0, 397.0, 397.0, 2.651640702684786, 1.9084562479284057, 1.5511062313556514], "isController": false}, {"data": ["POST Register (Buyer)", 8, 0, 0.0, 423.25, 357, 478, 446.0, 478.0, 478.0, 478.0, 2.58732212160414, 1.483162192755498, 0.0], "isController": false}, {"data": ["POST Login (Buyer)", 8, 0, 0.0, 378.87499999999994, 347, 427, 362.0, 427.0, 427.0, 427.0, 2.6041666666666665, 1.2868245442708333, 1.7191569010416667], "isController": false}, {"data": ["POST Login (Seller)", 8, 0, 0.0, 1267.875, 1141, 1517, 1213.0, 1517.0, 1517.0, 1517.0, 2.495321272613849, 1.2306027760449159, 1.0039769182782283], "isController": false}, {"data": ["POST Register (Seller)", 8, 0, 0.0, 1081.75, 346, 2936, 881.5, 2936.0, 2936.0, 2936.0, 2.0827909398594118, 1.1756378547253319, 0.0], "isController": false}, {"data": ["POST Seller Product", 8, 0, 0.0, 1242.875, 468, 2297, 1121.5, 2297.0, 2297.0, 2297.0, 2.15343203230148, 1.4678667563930015, 0.0], "isController": false}, {"data": ["GET Buyer Product", 8, 0, 0.0, 377.875, 328, 426, 381.5, 426.0, 426.0, 426.0, 2.579812963560142, 2.930002418574653, 0.0], "isController": false}, {"data": ["POST Buyer Order", 8, 0, 0.0, 319.375, 285, 392, 304.5, 392.0, 392.0, 392.0, 2.5054807391168183, 1.6980504227998747, 1.6270944253053554], "isController": false}, {"data": ["GET Buyer Order", 8, 0, 0.0, 319.625, 286, 383, 307.0, 383.0, 383.0, 383.0, 2.494543186778921, 2.9890668849391955, 1.4372856251948862], "isController": false}, {"data": ["GET Buyer Product id", 8, 0, 0.0, 318.375, 270, 366, 322.0, 366.0, 366.0, 366.0, 2.5173064820641913, 2.3894745122718692, 0.0], "isController": false}, {"data": ["GET Buyer Order id", 8, 0, 0.0, 326.375, 280, 367, 326.5, 367.0, 367.0, 367.0, 2.4052916416115453, 2.8774240829825617, 1.3999549007817198], "isController": false}, {"data": ["DELETE Seller Product id", 8, 0, 0.0, 387.75, 296, 829, 309.0, 829.0, 829.0, 829.0, 2.0871380120010437, 0.6563070701800157, 1.2657350639186016], "isController": false}, {"data": ["GET Seller Product", 8, 0, 0.0, 364.875, 293, 424, 372.5, 424.0, 424.0, 424.0, 2.602472348731295, 1.8781514313597918, 0.0], "isController": false}, {"data": ["PUT Buyer Order id", 8, 0, 0.0, 313.875, 282, 393, 293.0, 393.0, 393.0, 393.0, 2.4220405691795337, 1.6320390554041782, 1.5256017257039056], "isController": false}, {"data": ["DELETE Buyer Order id", 8, 0, 0.0, 311.5, 281, 370, 289.0, 370.0, 370.0, 370.0, 2.416918429003021, 0.7788897280966767, 1.4586480362537764], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 120, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
