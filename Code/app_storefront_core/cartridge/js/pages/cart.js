'use strict';

var account = require('./account'),
    bonusProductsView = require('../bonus-products-view'),
    quickview = require('../quickview'),
    cartStoreInventory = require('../storeinventory/cart');

/**
 * @private
 * @function
 * @description Binds events to the cart page (edit item's details, bonus item's actions, coupon code entry)
 */
function initializeEvents() {
    $('#cart-table').on('click', '.item-edit-details a', function (e) {
        e.preventDefault();
        quickview.show({
            url: e.target.href,
            source: 'cart'
        });
    })
        .on('click', '.bonus-item-actions a, .item-details .bonusproducts a', function (e) {
            e.preventDefault();
            bonusProductsView.show(this.href);
        });

    // override enter key for coupon code entry
    $('form input[name$="_couponCode"]').on('keydown', function (e) {
        if (e.which === 13 && $(this).val().length === 0) { return false; }
    });

    //to prevent multiple submissions of the form when removing a product from the cart
    var removeItemEvent = false;
    $('button[name$="deleteProduct"]').on('click', function (e) {
        if (removeItemEvent) {
            e.preventDefault();
        } else {
            removeItemEvent = true;
        }
    });


    //foreach on quantity row to disable buttons by default if needed
    $('.quantity').each(function() {
        var min= 1;
        var max = 10;
        var maxInventory = parseInt($(this).data('max'),10);
        var quantity = parseInt($(this).find('.quantity-number').val(),10);
        //check max
        if(max > maxInventory){
            max = maxInventory;
        }
        $(this).find('.minus').attr('disabled',quantity <= min);
        $(this).find('.plus').attr('disabled',quantity >= max);
    });


    //On click remove Item
    $('.cart-quantity').on('click', function () {

        var min= 1;
        var max = 10;
        var newQuantity;
        var type=$(this).data('type');
        var maxInventory = parseInt($(this).parent().data('max'),10);
        var quantity = parseInt($(this).closest('.quantity').find('.quantity-number').val(),10);

        //check max
        if(max > maxInventory){
            max = maxInventory;
        }
        newQuantity = (type == 'minus') ? quantity -1 :  quantity + 1;
        $(this).closest('.quantity').find('.minus').attr('disabled',newQuantity <= min);
        $(this).closest('.quantity').find('.plus').attr('disabled',newQuantity >= min);
        $(this).closest('.quantity').find('.quantity-number').val(newQuantity);
        $('button#update-cart').trigger('click');
    });

}

exports.init = function () {
    initializeEvents();
    if (SitePreferences.STORE_PICKUP) {
        cartStoreInventory.init();
    }
    account.initCartLogin();
};
