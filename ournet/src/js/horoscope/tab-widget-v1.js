
(function ($w, $options) {
    /**
     * data object: {signs:[{id:1,name:'Sign name',info:'Horoscope info'}], source:{link:'horoscop.ournet.ro', name: 'Ournet.ro'}}
     * options: {html:true,}
     */
    OURNET.horo.createTabWidgetsV1 = function (widgetData, options) {
        options = assign(assign({}, $options), options);
        buildWidgets(widgetData, options);
    };

    function buildWidget(el, widgetData, options) {
        var signs = widgetData.signs;
        var source = widgetData.source;
        var $sc = options.wsc || options.wc;
        var dom = options.dom;

        options.sign = parseInt(options.dom.getAttr(el, 'data-sign') || options.store.get() || options.sign || 1);

        if (options.html) {
            var html = '<div class="' + $sc + 'inner' + '">';
            html += '<div class="' + $sc + 'signs">';
            for (var i = 0; i < signs.length; i++) {
                var sign = signs[i];
                html += '<i class="' + $sc + 'sign-' + sign.id + '" title="' + encodeURIComponent(sign.name) + '">' + i + '</i>';
            }
            // /signs
            html += '</div>';
            html += '<div class="' + $sc + 'summary"></div>';
            // /inner
            html += '</div>';
            if (source) {
                html += '<div class="' + $sc + 'footer' + '"><a href="' + source.link + '">' + decodeURIComponent(source.name || '') + '</a></div>';
            }
            el.innerHTML = html;
        }

        var signElements = el.getElementsByTagName('i');
        if (!signElements) {
            console.log('no signs found');
            return;
        }
        options.elements = signElements;

        for (var i = 0; i < signElements.length; i++) {
            showInfo(el, signElements[i], signs[i], options);
        }

        var selectedSign = null;
        for (var i = 0; i < signs.length; i++) {
            var sign = signs[i];
            if (sign.id == options.sign) {
                selectedSign = sign;
                break;
            }
        }
        if (selectedSign) {
            putSignSummary(el, selectedSign, options);
        }
    }

    function showInfo(widget, iel, sign, options) {
        var store = options.store;
        iel.onclick = function () {
            console.log('sign', sign.id);
            putSignSummary(widget, sign, options);
            store.save(sign.id);
        };
    }

    function putSignSummary(widget, sign, options) {
        var $sc = options.wsc || options.wc;
        var container = $sc + 'summary';
        var el = options.dom.getElementsByClassname(container, null, widget);
        if (el && el.length) {
            el[0].innerText = sign.summary;
        }

        options.dom.removeClass(options.elements[options.sign - 1], 'selected');
        options.dom.addClass(options.elements[sign.id - 1], 'selected');

        options.sign = sign.id;
    }

    function buildWidgets(widgetData, options) {
        var elements = options.dom.getElementsByClassname(options.wc);
        if (!elements || !elements.length) {
            console.log('No elements found');
            return;
        }
        for (var i = 0; i < elements.length; i++) {
            buildWidget(elements[i], widgetData, options);
        }
    }

    function assign(target, source) {
        for (var prop in source) {
            if (source[prop] !== undefined) {
                target[prop] = source[prop];
            }
        }

        return target;
    }

})(window, { wc: 'ONhoro-twv1', wsc: 'twv1-', store: OURNET.horo.CookieHoroscopeSignStore(), dom: OURNET.dom, sign: 1, html: true });
