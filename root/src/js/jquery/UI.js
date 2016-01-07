(function(_ga) {
	var UI = {
		__inited: false,
		__onLoadContent: []
	};
	UI.addOnLoadContent = function(f) {
		UI.__onLoadContent.push(f);
	}

	UI._executeOnLoadContent = function() {
		for (var i = 0; i < UI.__onLoadContent.length; i++) {
			var f = UI.__onLoadContent[i];
			f();
		}
	}

	UI.reload = function() {
		//location.replace(location);
		location.href = location;
	}

	UI.goto = function(url) {
		location.href = url;
	}

	UI.dialog = function(url, data, callback) {
		if (typeof data == 'function') {
			callback = data;
			data = {};
		}
		data = $.extend({
			ajaxcall: true,
			ul: UI.Constants.ul,
			cn: UI.Constants.cn
		}, data);
		Dialog.load(url, data, function() {
			if (callback) callback();
		});
		return false;
	}

	UI.post = function(url, data, callback) {
		UI.ajax('POST', url, data, callback);
		return false;
	}

	UI.get = function(url, data, callback) {
		UI.ajax('GET', url, data, callback);
		return false;
	}

	UI.ajax = function(method, url, data, callback) {
		if (typeof data == 'function') {
			callback = data;
			data = {};
		}
		var settings = {
			ajaxcall: true,
			ul: UI.Constants.ul,
			cn: UI.Constants.cn
		};
		if (data) {
			settings = $.extend(settings, data);
		}
		UI.Loading.show();
		$.ajax({
			url: url,
			type: method,
			data: settings,
			success: function(result) {
				processSuccess(result);
			},
			error: function(obj, err, data) {
				UI.Loading.hide();
				UI.Informer.error();
			}
		});

		function processSuccess(result) {
			UI.Loading.hide();
			if (typeof(result) != 'object') {
				if (callback) callback(result);
				return;
			}
			UI.processAjaxResult(result);
			if (result.success) {
				if (callback) callback(result);
			}
			if (result.jscript) {
				eval(result.jscript);
			}
		}
		return false;
	}

	UI.load = function(selector, url, data, callback) {
		if (typeof data == 'function') {
			callback = data;
			data = {};
		}
		var settings = {
			ajaxcall: true,
			ul: UI.Constants.ul,
			cn: UI.Constants.cn
		};
		if (data) {
			settings = $.extend(settings, data);
		}
		//console.log(settings);
		UI.Loading.show();
		$.ajax({
			url: url,
			type: 'GET',
			data: settings,
			success: function(result) {
				UI.Loading.hide();
				$(selector).html(result);
				if (callback) callback(result);
			},
			error: function() {
				UI.Loading.hide();
				UI.Informer.error();
			}
		});
		return false;
	}

	UI.Constants = {
		SID: null,
		SKey: null,
		unknown_error: 'Unknown error. Please try later.',
		is_logged: false,
		ul: null,
		cn: null,
		getCulture: function(d) {
			d = d || '-';
			var cn = UI.Constants.ul.toString().toUpperCase();
			switch (UI.Constants.ul) {
				case 'en':
					return cn = 'US';
			}
			return UI.Constants.ul + d + cn;
		}
	}

	UI.init = function() {
		if (UI.__inited) return;
		//UI.Urls.init();
		//initAjaxFormsForms();
		//UI.initFormObserver();
		//UI.initTooltip()
		UI.__inited = true;
	}

	UI.initTooltip = function() {
		$('[rel="tooltip"]').tooltip();
	}

	UI.processAjaxResult = function(data) {
		if (data && data.trackerEvent && _ga) {
			_ga.pushEvent(data.trackerEvent);
		}
		if (data && data.info) {
			UI.Informer.show(data.info);
		}
		if (data && data.action) {
			UI.processAction(data.action);
		}
	}

	UI.processAction = function(action) {
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
	}

	function getFunction(code, argNames) {
		var fn = window,
			parts = (code || "").split(".");
		while (fn && parts.length) {
			fn = fn[parts.shift()];
		}
		if (typeof(fn) === "function") {
			return fn;
		}
		argNames.push(code);
		return Function.constructor.apply(null, argNames);
	};

	/*          loading     */

	UI.Loading = {};
	UI.Loading._isloading = false;
	UI.Loading._inited = false;
	UI.Loading._init = function() {
		$('#loading-index').html('<div id="loading"><div class="wrapper"><div class="back"></div><span class="icon"></span></div></div>');
		UI.Loading._inited = true;
	};
	UI.Loading.isloading = function() {
		return UI.Loading._isloading;
	};
	UI.Loading.show = function() {
		UI.Loading._isloading = true;
		if (!UI.Loading._inited) UI.Loading._init();
		$('#loading').show();
	};
	UI.Loading.hide = function() {
		UI.Loading._isloading = false;
		$('#loading').hide();
	};

	/*      loading         */

	/*      informer        */

	UI.Informer = {};
	UI.Informer._inited = false;
	UI.Informer._timer = null;
	UI.Informer._onShow = null;
	UI.Informer._init = function() {
		$('#informer-index').html('<div id="informer"></div>');
		UI.Informer._inited = true;
	};

	UI.Informer.show = function(info) {
		if (UI.Informer._timer != null) window.clearTimeout(UI.Informer._timer);
		if (!UI.Informer._inited) {
			UI.Informer._init();
		}
		if (info.type == undefined) info.type = 1;
		var i = $('#informer');
		i.html('<div id="informer-msg" class="type-' + info.type + '"><span class="icon msg-icon"></span><span class="msg">' + info.message + '</span><span onclick="UI.Informer.hide();" class="close-icon">&times;</span></div>');
		i.fadeIn('fast');
		//i.slideDown('fast');
		info.time = info.time || 10;
		UI.Informer._timer = window.setTimeout('UI.Informer.hide();', parseInt(info.time) * 1000);
		if (UI.Informer._onShow) UI.Informer._onShow(info);
	};
	UI.Informer.hide = function() {
		if (UI.Informer._timer != null) window.clearTimeout(UI.Informer._timer);
		var i = $('#informer');
		i.fadeOut('slow');
	};
	UI.Informer.error = function(mess) {
		mess = mess || UI.Constants.unknown_error;
		UI.Informer.show({
			message: mess,
			type: 1,
			time: 5
		});
	}

	UI.isUrl = function isUrl(s) {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(s);
	};

	function addUrlParam(url, pname, pvalue) {
		if (!pvalue) return url;
		var s = '?';
		if (url.indexOf('?') > 0) s = '&';
		return url + s + pname + '=' + pvalue;
	}

	function setUrlParam(uri, key, value) {
		var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		} else {
			return uri + separator + key + "=" + value;
		}
	}

	function removeUrlParam(url, param) {
		var urlparts = url.split('?');
		if (urlparts.length >= 2) {
			var prefix = encodeURIComponent(param) + '=';
			var pars = urlparts[1].split(/[&;]/g);
			for (var i = pars.length; i-- > 0;)
				if (pars[i].indexOf(prefix, 0) == 0)
					pars.splice(i, 1);
			if (pars.length > 0)
				return urlparts[0] + '?' + pars.join('&');
			else
				return urlparts[0];
		} else
			return url;
	}

	function doNothink() {}

	function getTrue() {
		return true;
	}

	function getFalse() {
		return false;
	}

	UI.FB = {
		Id: '193314429413',
		_inited: false,
		init: function(callback) {
			if (UI.FB._inited == true && callback) callback();
			else {
				window.fbAsyncInit = function() {
					UI.FB._inited = true;
					FB.init({
						appId: UI.FB.Id,
						status: false,
						cookie: true,
						xfbml: false
					});
					if (callback) callback();
				};
				(function() {
					var e = document.createElement('script');
					e.async = true;
					e.src = document.location.protocol +
						'//connect.facebook.net/' + UI.Constants.getCulture('_') + '/all.js';
					document.getElementById('fb-root').appendChild(e);
				}());
			}
		}
	}

	window.UI = UI;

})(GA);