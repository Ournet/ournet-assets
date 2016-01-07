(function() {
	function init() {
		$('body').on('click', '.a-action', function() {
			var t = $(this);
			var type = t.attr('data-action-type');
			var data = t.attr('data-action-data') || {};
			if (typeof(data) == "string") data = eval('(' + data + ')');
			var url = t.attr('data-action-url');
			var callback = t.attr('data-action-callback');
			var conf = t.attr('data-action-confirm');
			if (conf && conf.length > 2)
				if (!confirm(conf)) return false;

			function cb() {
				if (!callback) return;
				var f = eval(callback);
				if (typeof f == "function") f();
			}
			switch (type) {
				case 'dialog':
					UI.dialog(url, data, cb);
					break;
				default:
					UI.post(url, data, cb);
			}
			return false;
		});
		$('body').on('click', '.ajax-replace-target', function() {
			try {
				var t = $(this);
				var data = {
					ajaxcall: true,
					ul: UI.Constants.ul
				};
				var data_t = t.attr('data-ajax-data') || '{}';
				var el = t;
				var data_el = '{}';
				if (!t.hasClass('ajax-replace')) {
					el = t.closest('.ajax-replace');
					data_el = el.attr('data-ajax-data') || '{}';
				}
				data_t = eval('(' + data_t + ')');
				data_el = eval('(' + data_el + ')');
				data = $.extend(data, data_el, data_t);
				var url = el.attr('data-ajax-url') || el.attr('href');
				UI.post(url, data, function(result) {
					if (result.data && result.data != '') {
						el.fadeOut('fast', function() {
							$(result.data).insertBefore(el);
							el.remove();
						});
					}
				});

			} catch (e) {
				alert(e);
			}
			return false;
		});
	}
	$(document).ready(init);
})();