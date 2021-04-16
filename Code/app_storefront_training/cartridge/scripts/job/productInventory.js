"use strict";

var Logger = require("dw/system/Logger");
var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");

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
  var feedFileName = "InventoryList.txt";
  var fullPath = feedDirectory + feedFileName;

  if (!File(feedDirectory).isDirectory()) {
    // check if directory exists..
    File(feedDirectory).mkdir(); // creating new directory if not exist.
  }

  var ProductMgr = require("dw/catalog/ProductMgr");
  var ProductInventoryMgr = require("dw/catalog/ProductInventoryMgr");
  var inventoryList = ProductInventoryMgr.getInventoryList();
  var ids = [];
  var products = ProductMgr.queryAllSiteProducts();
  while (products.hasNext()) {
    var prod = products.next();
    if (!prod.isMaster() && prod.isVariant()) {
      var list = inventoryList.getRecord(prod);
      if (list) {
        var quantity = list.allocation.value;
        if (quantity == 100) {
          list.setAllocation(99);
          var updatedQuantity = list.allocation.value;
          var data = {
            productID: prod.ID,
            quantity: quantity,
            updatedQuantity: updatedQuantity,
          };
          ids.push(data);
        }
      }
    }
  }

  var file = new File(fullPath);
  var fileWriter = new FileWriter(file, "UTF-8", false);
  fileWriter.writeLine(JSON.stringify(ids));
  if (fileWriter) fileWriter.close();
}
module.exports.execute = execute;
