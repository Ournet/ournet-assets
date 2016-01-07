var Dialog = {
	_inited: false,
	_showing: false,
	_callback: null,
	_changedsize: false,
	_useFade: true,
	init: function() {
		if (Dialog._inited) return;
		$('#dialog-index').append('<div id="dialog"><div id="dialog-wrapper"><span class="close-icon" id="dialog-close-btn" onclick="Dialog.close();">&times;</span><div id="dialog-content"></div></div></div>');
		Dialog._inited = true;
	},
	show_loading: function() {
		UI.Loading.show();
	},
	hide_loading: function() {
		UI.Loading.hide();
	},
	load: function(url, data, callback) {
		if (!url) return;
		if (typeof data == 'function') {
			callback = data;
			data = null;
		}
		data = data || {};
		var settings = {
			showtitle: true,
			ajaxcall: true,
			dialogcall: true,
			ul: UI.Constants.ul
		};
		if (data) {
			$.extend(settings, data);
		}
		Dialog._callback = callback;
		Dialog.close();
		if (url) {
			Dialog.show_loading();
			$.ajax({
				url: url,
				type: 'POST',
				data: settings,
				success: function(result, status, request) {
					Dialog.hide_loading();
					//alert(request.getAllResponseHeaders());
					if (typeof result == 'object') {
						UI.processAjaxResult(result);
					} else {
						if (result && result != '') {
							Dialog.show();
							Dialog.set_content(result);
						}
					}
					if (callback) callback();
				},
				error: function(err) {
					Dialog.hide_loading();
					UI.Informer.error();
				}
			});
		}
	},
	set_content: function(content) {
		$("#dialog-content").html(content + '<div class="clear"></div>');
	},
	set_callback: function(callback) {
		Dialog._callback = callback;
	},
	callback: function(obj) {
		if (Dialog._callback)
			Dialog._callback(obj);
	},
	show: function(content) {
		Dialog._show();
		if (content)
			Dialog.set_content(content);
	},
	_hide: function() {
		$("#dialog").fadeOut(50);
		Dialog._showing = false;
	},
	_show: function() {
		Dialog.set_content('');
		if (Dialog._useFade) $("#dialog").fadeIn(300);
		else $("#dialog").show();
		Dialog._showing = true;
	},
	close: function(seconds) {
		Dialog._hide();
		Dialog.set_content('');
	},
	closeRefresh: function() {
		Dialog.close();
		location.reload();
	}
};
