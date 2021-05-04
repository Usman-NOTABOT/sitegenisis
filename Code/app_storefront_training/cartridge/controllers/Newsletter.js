"use strict";

/* Script Modules */
var app = require("app_storefront_controllers/cartridge/scripts/app");
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var ISML = require("dw/template/ISML");
var URLUtils = require("dw/web/URLUtils");

function start() {
	app.getForm("newsletter").clear();
	app.getView({
		ContinueURL: URLUtils.https("Newsletter-HandleForm"),
	}).render("newsletter");
}

function handleForm() {
	app.getForm("newsletter").handleAction({
		cancel: function () {
			response.redirect(URLUtils.https("Home-Show"));
		},
		submit: function (formgroup) {
			var CustomObjectMgr = require("dw/object/CustomObjectMgr");
			var email = session.forms.newsletter.email.getHtmlValue();
			var check = CustomObjectMgr.getCustomObject("newsletter-task", email);
			if (check) {
				app.getView({
					ContinueURL: URLUtils.https("newsletter-HandleForm"),
					error: "Email already Exists",
				}).render("newsletter");
			} else {
				var Transaction = require("dw/system/Transaction");
				var PromotionMgr = require("dw/campaign/PromotionMgr");
				var campaign = PromotionMgr.getCampaign("testing-newsletter-task");
				campaign.getCoupons().toArray().forEach(function (code) {
						if (code.ID == "newsletter-coupon") {
							Transaction.wrap(function () {
								var nextCode = code.getNextCouponCode();
								if (nextCode) {
									var obj = CustomObjectMgr.createCustomObject(
										"newsletter-task",
										email
									);
									obj.custom.couponCode = nextCode;
									var Email = app.getModel("Email");
									var Mail = Email.get("helloworld1", email);
									Mail.setSubject("Coupon Code");
									Mail.send({
										Email: email,
										code: nextCode,
									});
									formgroup.copyTo(obj);
								}else{
                  var Logger = require('dw/system/Logger');
                  Logger.warn('no next coupon code for newsletters.');
                }
							});
						}
					});
				app.getView().render("Helloformresult");
			}
		},
	});
}

/** Shows the template page. */
exports.Start = guard.ensure(["get"], start);
exports.HandleForm = guard.ensure(["post"], handleForm);
