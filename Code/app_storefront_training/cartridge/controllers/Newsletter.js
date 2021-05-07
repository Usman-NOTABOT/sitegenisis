"use strict";

/* Script Modules */
var app = require("app_storefront_controllers/cartridge/scripts/app");
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var URLUtils = require("dw/web/URLUtils");
var Resource = require('dw/web/Resource');

function start() {
	app.getForm("newsletter").clear();
	app.getView({ContinueURL: URLUtils.https("Newsletter-HandleForm")}).render("newsletter");
}

function handleForm() {
	app.getForm("newsletter").handleAction({
		cancel: function () {
			response.redirect(URLUtils.https("Home-Show"));
		},
		submit: function (formgroup) {
			var CustomObjectMgr = require("dw/object/CustomObjectMgr");
			var email = session.forms.newsletter.email.getHtmlValue();
			var alreadyExists = CustomObjectMgr.getCustomObject("newsletter-task", email);
			if (alreadyExists) {
				app.getView({ContinueURL: URLUtils.https("Newsletter-HandleForm"), error: Resource.msg('email.error', 'error', null)}).render("newsletter");
			} else {
				var PromotionMgr = require("dw/campaign/PromotionMgr");
				var campaign = PromotionMgr.getCampaign("testing-newsletter-task");
				campaign.getCoupons().toArray().forEach(function (code) {
					if (code.ID == "newsletter-coupon") {
						var Transaction = require('dw/system/Transaction');
						Transaction.wrap(function () {
							var nextCode = code.getNextCouponCode();
							if (!nextCode) {
								var Logger = require("dw/system/Logger");
								Logger.warn("no next coupon code for newsletters.");
								app.getView({key: 'error'}).render('noCouponCode');	
							}
							var obj = CustomObjectMgr.createCustomObject("newsletter-task", email);
							obj.custom.couponCode = nextCode;
							var Email = app.getModel("Email");
							var Mail = Email.get("helloworld1", email);
							Mail.setSubject(Resource.msg('newsletteremail.subject', 'email', null));
							Mail.send({
								Email: email,
								code: nextCode
							});
							formgroup.copyTo(obj);
							app.getView().render("Helloformresult");
						});
					}
				});
			}
		}
	});
}

/** Shows the template page. */
exports.Start = guard.ensure(["get"], start);
exports.HandleForm = guard.ensure(["post"], handleForm);
