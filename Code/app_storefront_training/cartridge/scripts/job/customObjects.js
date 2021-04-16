"use strict";

var Logger = require("dw/system/Logger");
var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var CustomObjectMgr = require("dw/object/CustomObjectMgr");

/**
 * Entry point for job.
 * Create JSON of orders for Dataroma
 * Save file on IMPEX
 */

function execute(param) {
  var feedDirectory =
    File.IMPEX +
    File.SEPARATOR +
    "src" +
    File.SEPARATOR +
    "test" +
    File.SEPARATOR;
  var feedFileName = "CustomObjectManager.txt";
  var fullPath = feedDirectory + feedFileName;

  if (!File(feedDirectory).isDirectory()) {
    // check if directory exists..
    File(feedDirectory).mkdir(); // creating new directory if not exist.
  }

  var deletedIds = [];
  var customObjMgr = CustomObjectMgr.getAllCustomObjects("newsletter");

  var date = new Date();
  var time = date.valueOf(); //current time (milliseconds)

  while (customObjMgr.hasNext()) {
    var object = customObjMgr.next();
    var creationTime = object.creationDate.valueOf();
    var timeDifference = time - creationTime;
    var timeDifferenceHour  = timeDifference / (1000 * 60 * 60);

    if (timeDifferenceHour > param.time) {
      deletedIds.push(object.custom.email);

      //Error handling
      var Transaction = require('dw/system/Transaction');
      Transaction.wrap(function(){
        CustomObjectMgr.remove(object);
      });
    }
  }

  var file = new File(fullPath);
  var fileWriter = new FileWriter(file, "UTF-8", false);
  fileWriter.writeLine(JSON.stringify(deletedIds));
  if (fileWriter) fileWriter.close();
}
module.exports.execute = execute;
