"use strict";

/* Script Modules */
var app = require("app_storefront_controllers/cartridge/scripts/app");
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var ISML = require("dw/template/ISML");
var URLUtils = require("dw/web/URLUtils");
var response = require("*/cartridge/scripts/util/Response");

function start() {
  app.getView({ ContinueURL: URLUtils.https("Fixer-Convert") }).render("currencyConverter");
}

function convert() {
  var requestParam = request.httpParameterMap;
  var amount = requestParam.amount.stringValue;
  var currencyConvert = requestParam.symbol.stringValue;
  var convertService = require('../scripts/services/service.js');
  var dataObj = {'symbol':currencyConvert,'amount':amount};
  var responseData = convertService.currencyConvert(dataObj);
  response.renderJSON(responseData);
}

function symbols() {
    var symbolService = require('../scripts/services/service.js');
    var responseData = symbolService.getSymbols();
    response.renderJSON(responseData);
}


/** Shows the template page. */
exports.Start = guard.ensure(["get"], start);
exports.Convert = guard.ensure(["get"], convert);
exports.Symbol = guard.ensure(["get"], symbols);
