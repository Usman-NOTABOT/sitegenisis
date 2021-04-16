"use strict";
// initialize app
// if jQuery has not been loaded, load from google cdn
if (!window.jQuery) {
    var s = document.createElement("script");
    s.setAttribute(
        "src",
        "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
    );
    s.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(s);
}

//require('./jquery-ext')();

$(document).ready(function () {
    var dropdown = $(".currencyDropdown").find("select");
    var url = Urls.getSymbols;
    $.ajax({
        url: url,
        dataType: "json",
        type: "GET",
        success: function (response) {
            if (response.success) {
                var symbols = response.data;
                symbols.forEach(function (symbol) {
                    dropdown.append(
                        '<option class="symbols" value="' +
                            symbol +
                            '">' +
                            symbol +
                            "</option>"
                    );
                });
            } else {
                alert("error line 28 currency js");
            }
        },
    });
});

$("#currencyForm").on("submit", function (e) {
    e.preventDefault();
    var url = $(this).attr("action");
    var amount = $(this).find("#dwfrm_fixer_currency").val();
    var currencyConvert = $(this).find("#dwfrm_fixer_currencyTo").val();
    if (amount == "" || currencyConvert == "") {
        alert("kithay payinnn ?");
    } else {
        $.ajax({
            type: "GET",
            url: url,
            data: { symbol: currencyConvert, amount: amount },
        }).done(function (response) {
            if (response.success) {
                $('#converted').html(response.convertedAmountData);
                console.log(response);
            } else {
                alert("error line 55 currency js");
            }
        });
    }
});
