UI = {};
UI.reload = function () {
    location.replace(location);
};
UI.goto = function (url) {
    location.href=url;
};
UI.dialog = function (url, data, callback) {
    if (typeof data == 'function') { callback = data; data = {}; }
    Dialog.load(url, data, callback);
};
UI.post = function (url, data, callback) {
    if (typeof data == 'function') { callback = data; data = {}; }
    var settings = {
        ajaxcall: true, ul: UI.Constants.ul
    };
    if (data) { $.extend(settings, data); }
    UI.Loading.show();
    $.ajax({ url: url, type: 'POST', data: settings,
        success: function (result) { processSuccess(result); },
        error: function (obj, err, data) {/* if (err == 'parsererror') { var data = eval('('+obj.responseText+')'); processSuccess(data); return; } */UI.Loading.hide(); UI.Informer.error(); }
    });
    function processSuccess(result) {
        UI.Loading.hide(); UI.processAjaxResult(result); if (result.success) { if (callback) callback(result); }
    }
};
//UI.jsonPost = function (url, data, callback) {
//    if (typeof data == 'function') { callback = data; data = {}; }
//    var settings = {
//        ajaxcall: true, ul: UI.Constants.ul
//    };
//    if (data) { $.extend(settings, data); }
//    UI.Loading.show();
//    $.ajax({ url: url, type: 'POST', contentType: 'application/json; charset=utf-8', data: JSON.stringify(settings), success: function (result) { UI.Loading.hide(); if (callback) callback(result); }, error: function () { UI.Loading.hide(); UI.Informer.error(); } });
//};
UI.load = function (selector, url, data, callback) {
    if (typeof data == 'function') { callback = data; data = {}; }
    var settings = {
        ajaxcall: true, ul: UI.Constants.ul
    };
    if (data) { $.extend(settings, data); }
    UI.Loading.show();
    $.ajax({ url: url, type: 'POST', data: settings, success: function (result) { UI.Loading.hide(); $(selector).html(result); if (callback) callback(result); }, error: function () { UI.Loading.hide(); UI.Informer.error(); } });
};

UI.Constants = {
    unknown_error: 'Unknown error. Please try later.',
    see_all: 'Vezi toate rezultatele &rsaquo;',
    is_logged: false,
    ul: null
};

UI.init = function () {
    UI.ajaxForm.parse();
    //UI.Follow.parse();
    //UI.initTooltip();
    //if (!UI.Constants.is_logged) return;
    $('.ajax-action').live('click', function () {
        var t = $(this);
        var url = t.attr('data-action-url');
        var data = t.attr('data-action-data');
        var success = t.attr('data-action-success');
        var callback = null;
        if (success) callback = getFunction(success);
        var that = this;
        UI.post(url, eval('(' + data + ')'), function () { if (callback) callback(that); });
    });
    $('.ajax-replace-target').live('click', function () {
        var t = $(this);
        var data = { ajaxcall: true, ul: UI.Constants.ul };
        var data_t = t.attr('data-ajax-data');
        if (!data_t || data_t == '') data_t = '{}';
        var ph = t;
        var data_r = '{}';
        if (!t.hasClass('ajax-replace')) {
            ph = t.closest('.ajax-replace');
            data_r = ph.attr('data-ajax-data');
            if (!data_r || data_r == '') data_r = '{}';
        }
        data_t = eval('(' + data_t + ')');
        data_r = eval('(' + data_r + ')');
        data = $.extend(data, data_r, data_t);
        var url = ph.attr('data-ajax-url');
        UI.post(url, data, function (result) {
            if (result.data && result.data != '') {
                ph.fadeOut('fast', function () { ph.parent().html(result.data); });
            }
        });
    });

};

UI.processAjaxResult = function (data) {
    if (data && data.info) {
        UI.Informer.show(data.info);
    }
    if (data && data.action) {
        UI.processAction(data.action);
    }
};
UI.processAction = function (action) {
    switch (action.name) {
        case 'redirect':
            var url = location;
            if (action.data) url = action.data;
            location.replace(url);
            break;
        case 'reload':
            UI.reload();
            break;
        case 'dialog':
            if (action.data) UI.dialog(action.data);
            break;
    }
};
UI.popup = function(url) {
    var left = (window.screen.width - 500) / 2;
    var top = (window.screen.height - 500) / 2;
    var newwindow = window.open(url, 'name', 'height=500,width=500,left=' + left + ',top=' + top);
    if (window.focus) {
        newwindow.focus();
    }
    return false;
};
UI.popUp = UI.popup;

function getFunction(code, argNames) {
    var fn = window, parts = (code || "").split(".");
    while (fn && parts.length) {
        fn = fn[parts.shift()];
    }
    if (typeof (fn) === "function") {
        return fn;
    }
    argNames.push(code);
    return Function.constructor.apply(null, argNames);
};

/*          loading     */

UI.Loading = {};
UI.Loading._isloading = false;
UI.Loading._inited = false;
UI.Loading._init = function () {
    $('#loading-index').append('<div id="loading"><div class="wrapper"><div class="back"></div><span class="icon"></span></div></div>');
    UI.Loading._inited = true;
};
UI.Loading.isloading = function () {
    return UI.Loading._isloading;
};
UI.Loading.show = function () {
    UI.Loading._isloading = true;
    if (!UI.Loading._inited) UI.Loading._init();
    $('#loading').show();
};
UI.Loading.hide = function () {
    UI.Loading._isloading = false;
    $('#loading').hide();
};

/*      loading         */

/*      informer        */

UI.Informer = {};
UI.Informer._inited = false;
UI.Informer._timer = null;
UI.Informer._onShow = null;
UI.Informer._init = function () {
    $('#informer-index').append('<div id="the-informer"><div id="informer-bar"></div><div id="informer"></div></div>');
    UI.Informer._inited = true;
};

UI.Informer.show = function (info) {
    if (UI.Informer._timer != null) window.clearTimeout(UI.Informer._timer);
    if (!UI.Informer._inited) { UI.Informer._init(); }
    if (info.type == undefined) info.type = 1;
    $('#the-informer').slideUp(100);
    var i = $('#informer');
    i.html('<div id="informer-msg" class="type-' + info.type + '"><span class="icon msg-icon"></span><span class="msg">' + info.message + '</span><span onclick="UI.Informer.hide();" class="icon close-icon">&times;</span></div>');
    $('#the-informer').slideDown('fast');
    //i.slideDown('fast');
    info.time = info.time || 10;
    UI.Informer._timer = window.setTimeout('UI.Informer.hide();', parseInt(info.time) * 1000);
    if (UI.Informer._onShow) UI.Informer._onShow(info);
};
UI.Informer.hide = function () {
    if (UI.Informer._timer != null) window.clearTimeout(UI.Informer._timer);
    var i = $('#the-informer');
    i.slideUp('slow');
};
UI.Informer.error = function (mess) {
    mess = mess || UI.Constants.unknown_error;
    UI.Informer.show({ message: mess, type: 1, time: 5 });
};

/*      informer        */

/*      ajaxForm        */
UI.ajaxForm = {};

UI.ajaxForm.parse = function (selector, options) {
    selector = selector || 'form.ajax-form';
    var all = $(selector);
    $.each(all, function (i, form) {
        var ajaxForm = $.data(this[0], 'ajaxForm');
        if (ajaxForm) { return; }
        $.data(this[0], 'ajaxForm', true);
        //UI.ajaxForm.bindForm(this);
        var t = $(this);
        var dt = { ajaxcall: true };
        if (UI.Constants.ul) dt.ul = UI.Constants.ul;
        t.ajaxForm({
            url: t.attr('action'),
            type: 'POST',
            data: dt,
            success: function (data, status, xhr) {
                UI.processAjaxResult(data);
                UI.Loading.hide();
                if (data && data.success) {
                    getFunction(t.attr("data-ajax-success"), ["data", "status", "xhr"]).apply(this, arguments);
                } else {
                    var failattr = t.attr("data-ajax-failure");
                    getFunction(t.attr("data-ajax-failure"), ["data", "status", "xhr"]).apply(this, arguments);
                }
            },
            error: function () {
                var failattr = t.attr("data-ajax-failure");
                if (!failattr || failattr == '') UI.Informer.error();
                else { getFunction(failattr).apply(this, arguments); }
                UI.Loading.hide();
            },
            beforeSubmit: function () {
                if (options && options.beforeSubmit) {
                    if (!options.beforeSubmit()) return false;
                }
                UI.Loading.show();
            },
            dataType: 'json'
        });
    });
};
UI.isUrl = function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
};

/*      -ajaxForm-  */

function addUrlParam(url, pname, pvalue) {
    var s = '?';
    if (url.indexOf('?') > 0) s = '&';
    return url + s + pname + '=' + pvalue;
}

function doNothink() {}
function getTrue() { return true; }
function getFalse() { return false; }