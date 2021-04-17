var currencySoapService = require("../init/currencySoapService");
var Logger = require("dw/system/Logger");


function getConvertedAmount(total) {

    var request ={
        moneda:total.currencyCode
    }
    var result ={'success':false};
    var response = currencySoapService.getService.call(request);
    if(!response.ok){
        Logger.error(response.errorMessage);
        return result;
    }

    var value = response.object.getLatestValueResult;
    if(!value){
        Logger.error('value null');
        return result; 
    }
    var cartTotal = total.valueOrNull;
    if(!cartTotal){
        Logger.error('value null');
        return result; 
    }
    var Decimal = require('dw/util/Decimal');
    var decValue = new Decimal(value);
    var decCartTotal = new Decimal(cartTotal); 
    var convertedAmount = decValue.multiply(decCartTotal);

    result.success = true;
    result.data =convertedAmount.get();
    return result;
    
}

exports.getConvertedAmount = getConvertedAmount;