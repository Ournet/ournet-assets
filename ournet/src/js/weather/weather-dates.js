(function($, gd) {
	'use strict';

	$('#w-summary-menu').on('click', 'li', function() {
		var th = $(this);
		$.get('/controls/main_places_weather/' + th.attr('data-date'), {
			ul: gd.ul,
		}, function(result) {
			$.each($('#w-summary-menu li'), function() {
				$(this).removeClass('selected');
			});
			th.addClass('selected');
			$('#w-summary-content').html(result);
		});
	});
})(jQuery, globalInitData);
