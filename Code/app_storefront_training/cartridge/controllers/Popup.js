/**
 * A POpoup controller. This file is in cartridge/controllers folder
 * @module controllers JHelloWorld
 */
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var ISML = require("dw/template/ISML");
var ProductMgr = require("dw/catalog/ProductMgr");
var app = require("app_storefront_controllers/cartridge/scripts/app");

//testing function from controller
function showPopup() {
  var product;
  var pid = request.httpParameterMap.productId.stringValue;
  //Get Product id from param
  if (pid) {
    product = ProductMgr.getProduct(pid);
  }

  //Cart Model
  var Cart = app.getModel("Cart");
  var basket = Cart.get();
  var lineItem = basket.getAllProductLineItems(pid);

  ISML.renderTemplate("/Popups/productInfo.isml", {
    Basket: basket.object,
    productLineItem: lineItem[0],
  });
}
;

//testing function from controller
function showErrorPopup() {
  var errorKey = request.httpParameterMap.error.stringValue;

  var Resource = require('dw/web/Resource');
  ISML.renderTemplate("/Popups/productSearch.isml", {
    errorKey: Resource.msg(['error.msg', errorKey].join('.'),'search',null)
  });
}

exports.showPopup = guard.ensure(["get"], showPopup);
exports.showErrorPopup = guard.ensure(["get"], showErrorPopup)