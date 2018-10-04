
var $ = require('cash-dom');

var initedMenuContent = false;

function showMenu() {
    if (!initedMenuContent) {
        $('.c-mobm__ins').html($('.c-exp').html());
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
