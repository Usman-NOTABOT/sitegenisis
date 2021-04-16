/**
 * A hello world controller. This file is in cartridge/controllers folder
 * @module controllers JHelloWorld
 */
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var ISML = require("dw/template/ISML");

//testing function from controller
function start() {
  ISML.renderTemplate("helloworld1.isml", {
    myParameteronISML: "Hello from Controllers Usman only Testing abhi to",
  });
}

//Count all registered Customers
function count() {
  var CustomergMgr = dw.customer.CustomerMgr;
  var cc = CustomergMgr.getRegisteredCustomerCount();

  ISML.renderTemplate("helloworld1.isml", {
    myParameteronISML: cc,
  });
}
exports.Start = guard.ensure(["get"], start);
exports.Count = guard.ensure(["get"], count);
