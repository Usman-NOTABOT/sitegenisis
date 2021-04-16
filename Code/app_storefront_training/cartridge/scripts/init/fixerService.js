var LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");


//Service File

var service = LocalServiceRegistry.createService("FixerTest", {
  createRequest: function (svc, arguments) {
    //pass params, add headers etc
    //getting arguments and service from service js file
    var url = svc.configuration.credential.URL + arguments.endPoint;
    svc.setURL(url);
    svc.addHeader('Content-Type', 'application/json');
    svc.setRequestMethod(arguments.type);

  },
  parseResponse: function (service, client) {
      //reponse manipulation
      return client.text;
  }
});

exports.FixerService = service;
