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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8833333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "POST Register (Buyer)"], "isController": false}, {"data": [1.0, 500, 1500, "POST Login (Buyer)"], "isController": false}, {"data": [0.375, 500, 1500, "POST Login (Seller)"], "isController": false}, {"data": [0.25, 500, 1500, "POST Register (Seller)"], "isController": false}, {"data": [0.625, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [1.0, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Buyer Order id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 564.1833333333334, 276, 3529, 344.0, 1292.8999999999999, 1585.699999999999, 3529.0, 5.7714505579068875, 4.123055141400538, 2.0372919873028086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Seller Product id", 4, 0, 0.0, 315.5, 276, 370, 308.0, 370.0, 370.0, 370.0, 1.599360255897641, 1.1511020591763295, 0.935563274690124], "isController": false}, {"data": ["POST Register (Buyer)", 4, 0, 0.0, 363.25, 348, 380, 362.5, 380.0, 380.0, 380.0, 1.6142050040355125, 0.9253304075867634, 0.0], "isController": false}, {"data": ["POST Login (Buyer)", 4, 0, 0.0, 379.0, 355, 438, 361.5, 438.0, 438.0, 438.0, 1.6306563391765185, 0.805773542600897, 1.0764879739094986], "isController": false}, {"data": ["POST Login (Seller)", 4, 0, 0.0, 1343.25, 1212, 1600, 1280.5, 1600.0, 1600.0, 1600.0, 1.027749229188078, 0.5068489850976362, 0.4135084789311408], "isController": false}, {"data": ["POST Register (Seller)", 4, 0, 0.0, 2408.25, 1304, 3529, 2400.0, 3529.0, 3529.0, 3529.0, 0.8916629514043691, 0.5033019393669194, 0.0], "isController": false}, {"data": ["POST Seller Product", 4, 0, 0.0, 771.25, 346, 958, 890.5, 958.0, 958.0, 958.0, 1.25, 0.85205078125, 0.0], "isController": false}, {"data": ["GET Buyer Product", 4, 0, 0.0, 344.5, 325, 359, 347.0, 359.0, 359.0, 359.0, 1.6849199663016006, 1.913634688289806, 0.0], "isController": false}, {"data": ["POST Buyer Order", 4, 0, 0.0, 318.5, 294, 374, 303.0, 374.0, 374.0, 374.0, 1.6863406408094435, 1.1428910202360878, 1.095133326306914], "isController": false}, {"data": ["GET Buyer Order", 4, 0, 0.0, 308.25, 280, 378, 287.5, 378.0, 378.0, 378.0, 1.7467248908296944, 2.0929994541484715, 1.0064137554585153], "isController": false}, {"data": ["GET Buyer Product id", 4, 0, 0.0, 288.5, 277, 306, 285.5, 306.0, 306.0, 306.0, 1.6985138004246285, 1.6122611464968153, 0.0], "isController": false}, {"data": ["GET Buyer Order id", 4, 0, 0.0, 325.5, 285, 373, 322.0, 373.0, 373.0, 373.0, 1.8042399639152007, 2.1583925349571493, 1.050124041497519], "isController": false}, {"data": ["DELETE Seller Product id", 4, 0, 0.0, 334.0, 304, 383, 324.5, 383.0, 383.0, 383.0, 2.0181634712411705, 0.6346178102926338, 1.2239057769929365], "isController": false}, {"data": ["GET Seller Product", 4, 0, 0.0, 318.75, 308, 334, 316.5, 334.0, 334.0, 334.0, 1.5692428403295409, 1.1324906826206356, 0.0], "isController": false}, {"data": ["PUT Buyer Order id", 4, 0, 0.0, 327.25, 285, 374, 325.0, 374.0, 374.0, 374.0, 1.858736059479554, 1.2524686338289963, 1.1707858968401486], "isController": false}, {"data": ["DELETE Buyer Order id", 4, 0, 0.0, 317.0, 280, 372, 308.0, 372.0, 372.0, 372.0, 1.943634596695821, 0.6263666180758019, 1.1730138483965016], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
