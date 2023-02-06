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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8166666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "POST Register (Buyer)"], "isController": false}, {"data": [1.0, 500, 1500, "POST Login (Buyer)"], "isController": false}, {"data": [0.0, 500, 1500, "POST Login (Seller)"], "isController": false}, {"data": [0.0, 500, 1500, "POST Register (Seller)"], "isController": false}, {"data": [0.5, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [0.75, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Buyer Order id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 0, 0.0, 690.3000000000001, 277, 2817, 390.0, 2065.100000000001, 2574.45, 2817.0, 2.73972602739726, 1.9572274543378996, 0.9671090182648402], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Seller Product id", 2, 0, 0.0, 386.0, 327, 445, 386.0, 445.0, 445.0, 445.0, 1.4749262536873156, 1.0615436025073746, 0.8627742441002949], "isController": false}, {"data": ["POST Register (Buyer)", 2, 0, 0.0, 444.0, 440, 448, 444.0, 448.0, 448.0, 448.0, 1.4803849000740192, 0.8486190784603997, 0.0], "isController": false}, {"data": ["POST Login (Buyer)", 2, 0, 0.0, 399.5, 361, 438, 399.5, 438.0, 438.0, 438.0, 1.5835312747426762, 0.7824871338083927, 1.045378068091845], "isController": false}, {"data": ["POST Login (Seller)", 2, 0, 0.0, 1909.5, 1715, 2104, 1909.5, 2104.0, 2104.0, 2104.0, 0.6565988181221273, 0.32381094057780696, 0.2641784307288247], "isController": false}, {"data": ["POST Register (Seller)", 2, 0, 0.0, 2596.5, 2376, 2817, 2596.5, 2817.0, 2817.0, 2817.0, 0.6027727546714888, 0.3402369650391802, 0.0], "isController": false}, {"data": ["POST Seller Product", 2, 0, 0.0, 1022.0, 919, 1125, 1022.0, 1125.0, 1125.0, 1125.0, 0.888888888888889, 0.6059027777777778, 0.0], "isController": false}, {"data": ["GET Buyer Product", 2, 0, 0.0, 340.5, 335, 346, 340.5, 346.0, 346.0, 346.0, 1.7241379310344827, 1.9581761853448276, 0.0], "isController": false}, {"data": ["POST Buyer Order", 2, 0, 0.0, 786.0, 302, 1270, 786.0, 1270.0, 1270.0, 1270.0, 1.574803149606299, 1.0672982283464567, 1.022699311023622], "isController": false}, {"data": ["GET Buyer Order", 2, 0, 0.0, 349.0, 297, 401, 349.0, 401.0, 401.0, 401.0, 3.3003300330033003, 3.954594678217822, 1.9015573432343236], "isController": false}, {"data": ["GET Buyer Product id", 2, 0, 0.0, 303.0, 277, 329, 303.0, 329.0, 329.0, 329.0, 1.8315018315018314, 1.7384958791208789, 0.0], "isController": false}, {"data": ["GET Buyer Order id", 2, 0, 0.0, 343.0, 308, 378, 343.0, 378.0, 378.0, 378.0, 2.911208151382824, 3.482646470160116, 1.6944141193595341], "isController": false}, {"data": ["DELETE Seller Product id", 2, 0, 0.0, 387.5, 366, 409, 387.5, 409.0, 409.0, 409.0, 1.9569471624266144, 0.6153681506849314, 1.1867814334637965], "isController": false}, {"data": ["GET Seller Product", 2, 0, 0.0, 360.0, 311, 409, 360.0, 409.0, 409.0, 409.0, 1.3908205841446453, 1.0037269645340752, 0.0], "isController": false}, {"data": ["PUT Buyer Order id", 2, 0, 0.0, 338.5, 298, 379, 338.5, 379.0, 379.0, 379.0, 2.638522427440633, 1.7779106200527703, 1.6619599274406331], "isController": false}, {"data": ["DELETE Buyer Order id", 2, 0, 0.0, 389.5, 313, 466, 389.5, 466.0, 466.0, 466.0, 2.157497303128371, 0.6952872168284789, 1.3020833333333333], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
