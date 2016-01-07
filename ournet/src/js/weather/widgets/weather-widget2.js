(function(widgetClassName) {
	'use strict';
	var obj = window.ournetweatherwidget || [];
	obj.push = push;
	window.ournetweatherwidget = obj;
	var len = obj.length;
	var hosts = {
		ro: 'meteo.ournet.ro',
		md: 'meteo.click.md',
		ru: 'pogoda.zborg.ru',
		'in': 'weather.ournet.in',
		bg: 'vremeto.ournet.bg',
		hu: 'idojaras.ournet.hu',
		ua: 'pogoda.ournet.com.ua',
		it: 'meteo.ournet.it',
		cz: 'pocasi.ournet.cz',
		sk: 'pocasie.ournet.sk',
		by: 'pogoda.ournet.by',
		lt: 'orai.ournet.lt',
		lv: 'laika.ournet.lv',
		mx: 'tiempo.ournet.mx',
		rs: 'vreme.ournet.rs',
		pl: 'pogoda.diez.pl',
		al: 'www.moti2.al'
	};

	function push() {
		len++;
		try {
			var ins = getIns();
			createWidget(ins[ins.length - 1]);
		} catch (e) {}
	}

	function createInitialWidgets() {
		if (len > 0) {
			var ins = getIns();
			for (var i = 0; i < len; i++) {
				if (ins.length < len) {

				} else {
					createWidget(ins[i]);
				}
			}
		} else {
			//console.log('no ins');
		}
	}

	function getIns() {
		return getElementsByClassname(widgetClassName, 'ins');
	}

	function getIframePath(cn) {
		var host = hosts[cn];
		if (host) {
			return 'http://' + host + '/widget2/widget_frame';
		} else {
			return null;
		}
	}

	function createWidget(ins) {
		var cn = getAtrr(ins, 'data-cn');
		var params = getAtrr(ins, 'data-params');
		var w = getAtrr(ins, 'data-w');
		var h = getAtrr(ins, 'data-h');

		var path = getIframePath(cn);
		if (!path || !cn || !params || !w || !h) {
			return;
		}
		var ps = '?';
		var plist = params.split(',');
		plist.push('source=oww2');
		var host = window.location.hostname || 'unknown';
		plist.push('refhost=' + host);
		for (var i = 0; i < plist.length; i++) {
			var p = plist[i];
			ps += p;
			if (i < plist.length - 1) {
				ps += '&amp;';
			}
		}
		ins.innerHTML = '<i' + 'fra' + 'me src="' + path + ps + '" scrolling="no" frameborder="0" allowTransparency="true" style="border:none;overflow:hidden;height:' + h + 'px;width:' + w + 'px"></iframe>';
	}

	function getAtrr(ele, attr) {
		var result = (ele.getAttribute && ele.getAttribute(attr)) || null;
		if (!result) {
			var attrs = ele.attributes;
			var length = attrs.length;
			for (var i = 0; i < length; i++) {
				if (attrs[i].nodeName === attr) {
					result = attrs[i].nodeValue;
				}
			}
		}
		return result;
	}

	function getElementsByClassname(className, tagName, node) {
		node = node ? node : document;
		tagName = tagName ? tagName : '*';

		if (document.getElementsByClassName) {
			// If browser supports this function, use it.
			return node.getElementsByClassName(className);
		} else {
			// If the browser doesn't support the function, use custom test
			var allElems = node.getElementsByTagName(tagName),
				allElemsLength = allElems.length,
				elemList = [], //will be converted to NodeList when populated
				i = 0,
				currentElem;

			for (i; i < allElemsLength; i += 1) {
				currentElem = allElems[i];

				if (currentElem.className.search(className) !== -1) {
					elemList.push(currentElem);
				}
			}

			return elemList;
		}
	}

	function insertScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var ins = document.createElement('script');
    ins.async = 1;
    ins.src = url;
    head.appendChild(ins);
  }

	try {
		createInitialWidgets();
		// insertScript('//s3.eu-central-1.amazonaws.com/wrm/ins.js');
	} catch (e) {}
})('ournetweatherwidget');
