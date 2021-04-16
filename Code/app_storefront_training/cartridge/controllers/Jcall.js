var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var ISML = require("dw/template/ISML");

function start() {
  var myParam = request.httpParameterMap.param;
  if (myParam.stringValue != null) {
    /*Print variables */
    // response.getWriter().print('sadasd');

    /*Render template and send data*/
    ISML.renderTemplate("call/jnotempty.isml", {
      paramOnPdict: myParam,
    });
  } else {
    ISML.renderTemplate("test_decorator.isml", {
      paramOnPdict: "param not found",
    });
  }
}
exports.Start = guard.ensure(["get"], start);
