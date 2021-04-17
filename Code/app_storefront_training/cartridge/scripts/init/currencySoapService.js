//Service File to initiate call
var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

/**
 * Creates service for given service ID
 * @returns {Object} Service object
 */

exports.getService = LocalServiceRegistry.createService("currency.soap.get", {
    initServiceClient: function () {
        this.webReference = webreferences.infovalutar; //file name of wsdl
        this.serviceClient = this.webReference.getService("Curs", "CursSoap"); //service call in wsdl file (service,port name)
        return this.serviceClient;
    },
    createRequest: function (service, params) {
        var request = new this.webReference.GetLatestValue(); //operation
        request.moneda = params.moneda;
        return request;
    },
    execute: function (service, request) {
        return this.serviceClient.getLatestValue(request);
    },
    parseResponse: function (service, response) {
        return response;
    }
});
