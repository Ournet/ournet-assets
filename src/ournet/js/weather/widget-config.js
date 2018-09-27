
var autocomplete = require('autocompleter');
var CONSTANTS = require('../base/constants').CONSTANTS;
var $ = require('cash-dom');
var xhr = require("xhr");

$(function () {
    generateScript();
    $('.c-wconfig__input').on('blur', generateScript);
    $('.c-wconfig__btn').on('click', generateScript);
    $('#widget-configs').each(function (index, rootEl) {
        var root = $(rootEl);
        var previewSelector = root.data('preview');
        var scriptSelector = root.data('script');
        var tabs = $('.c-wconfig__tabs li', rootEl);
        var contents = $('.c-wconfig__content li', rootEl);

        tabs.on('click', function () {
            var tab = $(this);
            $('#widget-config-type').val(tab.data('type'));
            var index = tab.index();
            tabs.each(function () { $(this).removeClass('c-wconfig__tabs--selected') });
            tab.addClass('c-wconfig__tabs--selected');
            contents.each(function () { $(this).addClass('u-hidden') });
            contents.eq(index).removeClass('u-hidden');
        });
    });
});

function generateScript() {
    var data = getConfigData();
    data.ul = CONSTANTS.lang;
    var type = $('#widget-config-type').val();
    var url = '/' + type + '/widget_html_script';
    var query = [];
    for (var prop in data) {
        query.push(prop + '=' + encodeURIComponent(data[prop]));
    }
    url += '?' + query.join('&');

    xhr({
        url: url,
        timeout: 1000 * 3,
    }, function (error, res, body) {
        if (error) {
            console.error(error);
            return;
        }
        if (res.statusCode >= 400) {
            console.error(res.statusCode);
            return;
        }

        $('#widget-iframe').html(body);
        $('#widget-script').val(body);
    });
}

function getConfigData() {
    var data = {};
    $('.c-wconfig__content li', $('#widget-configs')).each(function () {
        var content = $(this);
        if (content.hasClass('u-hidden')) return;
        $('.c-wconfig__input', content).each(function () {
            var element = $(this);
            var name = element.attr('name');
            data[name] = element.val();
            if (element.attr('type') === 'checkbox') {
                data[name] = element.prop('checked') === true;
            }
        })
    });
    return data;
}

function searchPlaces(q, cb) {
    var URL_FORMAT = '/controls/findplace/?q=__Q__&ul=__LANG__';
    var url = URL_FORMAT
        .replace('__Q__', encodeURIComponent(q))
        .replace('__LANG__', CONSTANTS.lang);

    xhr({
        url: url,
        timeout: 1000 * 3,
    }, function (error, res, body) {
        if (error) {
            console.error(error);
            return cb([]);
        }
        if (res.statusCode >= 400) {
            console.error(res.statusCode);
            return cb([]);
        }

        cb(body);
    });
}