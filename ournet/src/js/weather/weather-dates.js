(function($, gd) {
	"use strict";

	$('#cn-summary').on('click', 'th', function() {
		var th = $(this);
		$.get('/controls/main_places_weather/' + th.attr('data-date'), {
			ul: gd.ul,
		}, function(result) {
			$.each($('#cn-summary th'), function() {
				$(this).removeClass('selected');
			});
			th.addClass('selected');
			$('#w-summary-content').html(result);
		});
	});
})(jQuery, globalInitData);
