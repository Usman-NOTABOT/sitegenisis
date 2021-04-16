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
  var feedFileName = "test.txt";
  var fullPath = feedDirectory + feedFileName;

  if (!File(feedDirectory).isDirectory()) {
    // check if directory exists..
    File(feedDirectory).mkdir(); // creating new directory if not exist.
  }
  var file = new File(fullPath);
  var fileWriter = new FileWriter(file, "UTF-8", false);
  fileWriter.writeLine("abnc");
  if (fileWriter) fileWriter.close();
}
module.exports.execute = execute;
