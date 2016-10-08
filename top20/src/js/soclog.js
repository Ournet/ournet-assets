'use strict';

(function(root, $, Popup) {

	$(root.document).ready(function() {
		$('.soclog-item a').click(function(evnt) {
			evnt.preventDefault();
			var el = $(this);
			var url = el.attr('href');
			Popup.popup({ url: url }, function() {
				var soc = el.closest('.soclog');
				url = soc.attr('data-redirect') || '/';
				root.location.assign(url);
			});

			return false;
		});
	});

})(window, jQuery, Popup);
