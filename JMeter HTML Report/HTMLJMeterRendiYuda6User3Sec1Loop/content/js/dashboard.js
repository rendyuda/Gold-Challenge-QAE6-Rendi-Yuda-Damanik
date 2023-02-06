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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8444444444444444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET Seller Product id"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "POST Register (Buyer)"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "POST Login (Buyer)"], "isController": false}, {"data": [0.25, 500, 1500, "POST Login (Seller)"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "POST Register (Seller)"], "isController": false}, {"data": [0.5, 500, 1500, "POST Seller Product"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "GET Buyer Product"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "POST Buyer Order"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "GET Buyer Order"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Buyer Order id"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Seller Product id"], "isController": false}, {"data": [1.0, 500, 1500, "GET Seller Product"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Buyer Order id"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "DELETE Buyer Order id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90, 0, 0.0, 621.6333333333334, 293, 4464, 379.0, 1299.8, 1939.3000000000013, 4464.0, 6.613270629730326, 4.724441316408259, 2.3344500881769417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Seller Product id", 6, 0, 0.0, 344.3333333333333, 307, 383, 343.5, 383.0, 383.0, 383.0, 1.4573718727228564, 1.048909248239009, 0.8525056169540928], "isController": false}, {"data": ["POST Register (Buyer)", 6, 0, 0.0, 421.16666666666663, 367, 531, 408.5, 531.0, 531.0, 531.0, 1.4306151645207439, 0.8200889663805436, 0.0], "isController": false}, {"data": ["POST Login (Buyer)", 6, 0, 0.0, 419.66666666666663, 363, 583, 380.0, 583.0, 583.0, 583.0, 1.4771048744460857, 0.7298975258493352, 0.9751200147710487], "isController": false}, {"data": ["POST Login (Seller)", 6, 0, 0.0, 1547.1666666666665, 1214, 2200, 1422.5, 2200.0, 2200.0, 2200.0, 1.4684287812041115, 0.7241763032305433, 0.5908131424375918], "isController": false}, {"data": ["POST Register (Seller)", 6, 0, 0.0, 1797.0, 356, 4464, 1436.5, 4464.0, 4464.0, 4464.0, 1.3440860215053765, 0.7586735551075268, 0.0], "isController": false}, {"data": ["POST Seller Product", 6, 0, 0.0, 1219.8333333333335, 495, 2496, 1147.0, 2496.0, 2496.0, 2496.0, 1.135718341851221, 0.7741517603634298, 0.0], "isController": false}, {"data": ["GET Buyer Product", 6, 0, 0.0, 470.0, 344, 737, 448.5, 737.0, 737.0, 737.0, 1.358695652173913, 1.543127972146739, 0.0], "isController": false}, {"data": ["POST Buyer Order", 6, 0, 0.0, 425.3333333333333, 307, 786, 376.0, 786.0, 786.0, 786.0, 1.3959981386691485, 0.9461159260120986, 0.90658082247557], "isController": false}, {"data": ["GET Buyer Order", 6, 0, 0.0, 482.3333333333333, 356, 1028, 381.5, 1028.0, 1028.0, 1028.0, 1.2148208139299452, 1.455649549503948, 0.6999455861510427], "isController": false}, {"data": ["GET Buyer Product id", 6, 0, 0.0, 343.5, 293, 373, 357.0, 373.0, 373.0, 373.0, 1.374885426214482, 1.305067025664528, 0.0], "isController": false}, {"data": ["GET Buyer Order id", 6, 0, 0.0, 352.5, 304, 408, 356.0, 408.0, 408.0, 408.0, 1.2282497441146367, 1.4693417349027635, 0.7148797338792221], "isController": false}, {"data": ["DELETE Seller Product id", 6, 0, 0.0, 371.1666666666667, 319, 420, 373.5, 420.0, 420.0, 420.0, 1.3134851138353765, 0.4130294986865149, 0.796556890323993], "isController": false}, {"data": ["GET Seller Product", 6, 0, 0.0, 366.3333333333333, 306, 414, 383.0, 414.0, 414.0, 414.0, 1.426872770511296, 1.0297450951248512, 0.0], "isController": false}, {"data": ["PUT Buyer Order id", 6, 0, 0.0, 333.8333333333333, 302, 366, 332.0, 366.0, 366.0, 366.0, 1.2285012285012284, 0.8277986793611793, 0.7738118089680589], "isController": false}, {"data": ["DELETE Buyer Order id", 6, 0, 0.0, 430.33333333333337, 310, 756, 369.5, 756.0, 756.0, 756.0, 1.2165450121654502, 0.3920506386861314, 0.7342039233576642], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
