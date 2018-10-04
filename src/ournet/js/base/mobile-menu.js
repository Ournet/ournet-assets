
var $ = require('cash-dom');

var initedMenuContent = false;

function showMenu() {
    if (!initedMenuContent) {
        var ref = $('.c-mobm').data('ref');
        if (ref) {
            $('.c-mobm__ins').html($(ref).html());
        }
        initedMenuContent = true;
    }
    $('.c-mobm__menu,.c-mobm__overlay').removeClass('u-hidden');
}

function hideMenu() {
    $('.c-mobm__menu,.c-mobm__overlay').addClass('u-hidden');
}

$(function () {
    $('.c-mobm__btn-btn').on('click', showMenu);
    $('.c-mobm__close-btn,.c-mobm__overlay').on('click', hideMenu);
});
