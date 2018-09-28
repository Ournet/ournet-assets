

var autocomplete = require('autocompleter').default;
var CONSTANTS = require('../base/constants').CONSTANTS;
var $ = require('cash-dom');
var xhr = require("xhr");


var widget;
var previewSelector;
var scriptSelector;

$(function () {
    widget = $('#widget-configs');
    if (!widget.length) {
        return;
    }
    previewSelector = $('.c-wconfig', widget).data('preview');
    scriptSelector = $('.c-wconfig', widget).data('script');

    generateScript();
    $('.c-wconfig__input').on('blur', generateScript);
    $('.c-wconfig__btn').on('click', generateScript);

    var tabs = $('.c-wconfig__tabs li', widget);
    var contents = $('.c-wconfig__content li', widget);

    tabs.on('click', function () {
        var tab = $(this);
        $('#widget-config-type').val(tab.data('type'));
        var index = tab.index();
        tabs.each(function () { $(this).removeClass('c-wconfig__tabs--selected') });
        tab.addClass('c-wconfig__tabs--selected');
        contents.each(function () { $(this).addClass('u-hidden') });
        contents.eq(index).removeClass('u-hidden');
        generateScript();
    });

    $('.c-wconfig__place').each(function () {
        var input = $(this);
        autocomplete({
            className: 'c-autocomplete',
            input: input[0],
            minLength: 2,
            fetch: searchPlaces,
            render: function (item, currentValue) {
                var doc = document;
                var div = doc.createElement("div");
                var divName = doc.createElement("div");
                divName.textContent = item.name;
                div.appendChild(divName);
                if (item.admin) {
                    var divAdminName = doc.createElement("div");
                    divAdminName.textContent = item.admin;
                    div.appendChild(divAdminName);
                }
                return div;
            },
            onSelect: function (item) {
                $('.c-wconfig__placeid', input.parent()).val(item.id);
                input.val(item.name);
                generateScript();
            },
        })
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

        $(previewSelector).html(body);
        $(scriptSelector).val(body);
    });
}

function getConfigData() {
    var data = {};
    $('.c-wconfig__content li', widget).each(function () {
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
        json: true,
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