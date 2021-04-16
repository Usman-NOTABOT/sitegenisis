var fixerService = require("../init/fixerService");
var Logger = require("dw/system/Logger");
var Site = require("dw/system/Site");
var accessKey = Site.getCurrent().getCustomPreferenceValue("fixer-access-key");

//Helper Service File
//Called from controller

function getSymbols(params) {
    var dataObj;
    var result = { success: false };

    try {
        //get all symbols

        if (accessKey) {
            var endPoint = "/symbols?access_key=" + accessKey;
            var args = { endPoint: endPoint, type: "GET" };
            var data = fixerService.FixerService.call(args);

            //validations
            if (data.status != "OK") {
                Logger.error(data.errorMessage);
                return result;
            }
            try {
                var dataObj = JSON.parse(data.object);
            } catch (error) {
                Logger.error("Error parsing response data");
                return result;
            }

            if (!dataObj.success) {
                Logger.error(dataObj.error.info);
                return result;
            }

            if (!dataObj.hasOwnProperty("symbols")) {
                Logger.error("No Symbols");
                return result;
            }

            //success case object
            result.data = Object.keys(dataObj.symbols);
            result.success = true;
            return result;
        }
    } catch (error) {
        Logger.warn(error.message);
        return result;
    }
}

function currencyConvert(params) {
    // http://data.fixer.io/api/latest
    // ? access_key = API_KEY
    // & base = USD
    // & symbols = GBP,JPY,EUR
    //get all symbols
    var dataObj;
    var result = { success: false };

    try {
        //get all symbols
        var endPoint =
            "/latest?access_key=" + accessKey + "&symbols=" + params.symbol;
        var args = { endPoint: endPoint, type: "GET" };
        var data = fixerService.FixerService.call(args);

        //validations
        if (data.status != "OK") {
            Logger.error(data.errorMessage);
            return result;
        }
        try {
            var dataObj = JSON.parse(data.object);
        } catch (error) {
            Logger.error("Error parsing response data");
            return result;
        }

        if (!dataObj.success) {
            Logger.error(dataObj.error.info);
            return result;
        }

        if (!dataObj.hasOwnProperty("rates")) {
            Logger.error("No Rates Provided at the moment");
            return result;
        }

        //success case object
        var rates = dataObj.rates;
        var rate = rates[params.symbol];
        if (!rate && !empty(rate)) {
            Logger.error("No conversion at the moment.");
            return result;
        }
        var Decimal = require("dw/util/Decimal");
        var amount = new Decimal(params.amount);
        var amountRate = new Decimal(rate);

        var convertedAmount = amount.multiply(amountRate);

        result.convertedAmountData = convertedAmount.get();
        result.success = true;
        return result;
    } catch (error) {
        Logger.warn(error.message);
        return result;
    }
}

exports.getSymbols = getSymbols;
exports.currencyConvert = currencyConvert;
