
var CONSTANTS = require('../base/constants').CONSTANTS;
var $ = require('cash-dom');
var xhr = require("xhr");
var URL_FORMAT = '/controls/places-daily-forecast/__DATE__/__IDS__?ul=__LANG__';

function getData(element, date, ids) {
    var url = URL_FORMAT
        .replace('__DATE__', date)
        .replace('__IDS__', ids)
        .replace('__LANG__', CONSTANTS.lang);

    xhr({
        url: url,
        timeout: 1000 * 8,
    }, function (error, res, body) {
        if (error) {
            console.error(error);
            return;
        }
        if (res.statusCode >= 400) {
            console.error(res.statusCode);
            return;
        }

        $('.c-forbro__content', element).html(body);
    });
}

$(function () {
    $('.c-forbro').each(function (index, element) {
        var ids = $(element).data('ids');
        var date = $('.c-forbro__tabs--selected', element).data('date');
        getData(element, date, ids);
        var lis = $('li', element);
        lis.on('click', function () {
            var li = $(this);
            lis.each(function () { $(this).removeClass('c-forbro__tabs--selected') });
            li.addClass('c-forbro__tabs--selected');
            getData(element, li.data('date'), ids);
        });
    });
});
