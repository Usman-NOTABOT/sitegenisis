"use strict";

/* Script Modules */
var app = require("app_storefront_controllers/cartridge/scripts/app");
var guard = require("app_storefront_controllers/cartridge/scripts/guard");
var ISML = require("dw/template/ISML");
var URLUtils = require("dw/web/URLUtils");

function start() {
  app.getForm("test_form").clear();
  app
    .getView({ ContinueURL: URLUtils.https("Testform-HandleForm") })
    .render("TestFormTemplate");
}

function handleForm() {
  app.getForm("test_form").handleAction({
    cancel: function () {
      response.redirect(URLUtils.https("Home-Show"));
    },
    submit: function (formgroup) {
      var CustomObjectMgr = require("dw/object/CustomObjectMgr");
      var email = session.forms.test_form.email.getHtmlValue();
      var nickname = session.forms.test_form.nickname.getHtmlValue();
      // var email = app.getForm('test_form.email').value();

      var check = CustomObjectMgr.getCustomObject("newsletter", email);
      if (check) {
        app
          .getView({
            ContinueURL: URLUtils.https("Testform-HandleForm"),
            error: "Email already Exists",
          })
          .render("TestFormTemplate");
      } else {
        //entered primary key
        var Transaction = require("dw/system/Transaction");
        //Implicit transaction
        Transaction.wrap(function () {
          var entry = CustomObjectMgr.createCustomObject("newsletter", email);
          //2. Send Email
              // var Email = require('./EmailModel');
            
              var Email = app.getModel('Email');
              var Mail = Email.get('helloworld1',email);
              Mail.setSubject('Email agyi hai ?');
              Mail.send({
                Email: email,
                Nickname: nickname
              });

          //binding used for Copyto
          formgroup.copyTo(entry);
          //can also save using
          // entry.custom.nickname = nickname;

        });
          app.getView().render("Helloformresult");
      }
    },
  });
}

/** Shows the template page. */
exports.Start = guard.ensure(["get"], start);
exports.HandleForm = guard.ensure(["post"], handleForm);