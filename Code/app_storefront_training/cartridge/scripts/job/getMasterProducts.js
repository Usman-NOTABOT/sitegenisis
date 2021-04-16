"use strict";

var Logger = require("dw/system/Logger");
var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var ProductMgr = require("dw/catalog/ProductMgr");
var CatalogMgr = require("dw/catalog/CatalogMgr");

/**
 * Entry point for job.
 * Create JSON of orders for Dataroma
 * Save file on IMPEX
 */

// function execute() {
//   var feedDirectory =
//     File.IMPEX +
//     File.SEPARATOR +
//     "src" +
//     File.SEPARATOR +
//     "test" +
//     File.SEPARATOR;
//   var feedFileName = "masterProducts.txt";
//   var fullPath = feedDirectory + feedFileName;

//   if (!File(feedDirectory).isDirectory()) {
//     // check if directory exists..
//     File(feedDirectory).mkdir(); // creating new directory if not exist.
//   }
//   var file = new File(fullPath);

//   var products= ProductMgr.queryAllSiteProducts();
//   var ids={'id':[]};
//   while (products.hasNext()) {
//       var prod = products.next();
//       if(prod.isMaster()){
//           //Push in object array
//           ids.id.push(prod.ID);
//       }
//   }

//   var fileWriter = new FileWriter(file, "UTF-8", false);
//   fileWriter.writeLine(JSON.stringify(ids));
//   if (fileWriter) fileWriter.close();
// }

function execute() {
  var feedDirectory =
    File.IMPEX +
    File.SEPARATOR +
    "src" +
    File.SEPARATOR +
    "test" +
    File.SEPARATOR;
  var feedFileName = "masterProducts.txt";
  var fullPath = feedDirectory + feedFileName;

  if (!File(feedDirectory).isDirectory()) {
    // check if directory exists..
    File(feedDirectory).mkdir(); // creating new directory if not exist.
  }
  var file = new File(fullPath);

  //Root category id
  var catalogID = CatalogMgr.getSiteCatalog().getRoot().getID();

  var ProductSearchModel = require("dw/catalog/ProductSearchModel");
  var psm = new ProductSearchModel();
  psm.setCategoryID(catalogID);
  psm.search();
  var prods = psm.getProductSearchHits();
  var ids = { id: [] };
  while (prods.hasNext()) {
      var pn = prods.next();
      var prod = pn.getProduct(); 
    if (prod.isMaster()) {
      ids.id.push(prod.ID);
    }
  }

  var fileWriter = new FileWriter(file, "UTF-8", false);
  fileWriter.writeLine(JSON.stringify(ids));
  if (fileWriter) fileWriter.close();
}

module.exports.execute = execute;
