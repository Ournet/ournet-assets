var Popup = {
	popup: function(data, cb) {
		//{url,w;h};
		if (typeof data === "undefined" || typeof data.url === "undefined") return;

		data.w = data.w || 500;
		data.h = data.h || 400;

		var left = (window.screen.width - data.w) / 2;
		var top = (window.screen.height - data.h) / 2;
		var w = window.open(data.url, 'name', 'height=' + data.h + ',width=' + data.w + ',left=' + left + ',top=' + top);
		if (window.focus) {
			w.focus();
		}
		if (cb) {
			w.onbeforeunload = cb;
		}
		return w;
	}
};
