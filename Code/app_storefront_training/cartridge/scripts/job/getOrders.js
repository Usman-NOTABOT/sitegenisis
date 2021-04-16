"use strict";

var Logger = require("dw/system/Logger");
var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var OrderMgr = require("dw/order/OrderMgr");

/**
 * Entry point for job.
 * Create JSON of orders for Dataroma
 * Save file on IMPEX
 */

function execute() {
  var feedDirectory =
    File.IMPEX +
    File.SEPARATOR +
    "src" +
    File.SEPARATOR +
    "test" +
    File.SEPARATOR;
  var feedFileName = "orderCSV.csv";
  var fullPath = feedDirectory + feedFileName;

  if (!File(feedDirectory).isDirectory()) {
    // check if directory exists..
    File(feedDirectory).mkdir(); // creating new directory if not exist.
  }

  var getOrders = OrderMgr.searchOrders(
    "status={0}",
    "creationDate desc",
    dw.order.Order.ORDER_STATUS_NEW
  );
  var ordersHeading = ["created-BY", "Order No"];
  var file = new File(fullPath);
  var fileWriter = new FileWriter(file, "UTF-8", false);
  var CSVStreamWriter = require('dw/io/CSVStreamWriter');
  var csvWriter = new CSVStreamWriter(fileWriter);
  csvWriter.writeNext(ordersHeading);

  while (getOrders.hasNext()) {
    var order = getOrders.next();
    var orders = [];

    var orderObj = {
      createdBy: order.createdBy,
      orderID: order.orderNo,
    };
    orders.push(order.createdBy);
    orders.push(order.orderNo);
    csvWriter.writeNext(orders);
  }
  csvWriter.close();
  fileWriter.close();
}
module.exports.execute = execute;
