(function() {
	var Dialog = {
		_inited: false,
		_showing: false,
		_callback: null,
		_changedsize: false,
		_useFade: true,
		_reloadOnClose: false,
		init: function() {
			if (Dialog._inited) return;
			$('#dialog-index').html('<div id="dialog-block-ui"></div><div id="dialog"><div id="dialog-wrapper"><span id="dialog-close-btn" onclick="Dialog.close();" class="close-icon">&times;</span><div id="dialog-content"></div></div></div>');
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
					type: 'GET',
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
								UI._executeOnLoadContent();
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
			$('#dialog-block-ui').hide();
			$("#dialog").fadeOut(50);
			Dialog._showing = false;
		},
		_show: function() {
			Dialog.init()
			Dialog.set_content('');
			$("#dialog").css('width', '');
			if (Dialog._useFade) $("#dialog").fadeIn(300);
			else $("#dialog").show();
			Dialog._showing = true;
			$('#dialog-block-ui').show();
		},
		close: function(seconds) {
			Dialog._hide();
			Dialog.set_content('');
			if (Dialog._reloadOnClose) {
				Dialog._reloadOnClose = false;
				location.reload();
			}
		},
		closeRefresh: function() {
			Dialog.close();
			location.reload();
		},
		reloadOnClose: function() {
			if (!Dialog._showing) return;
			Dialog._reloadOnClose = true;
		}
	}

	window.Dialog = Dialog;
})();