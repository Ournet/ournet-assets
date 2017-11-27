(function($, gd) {
	'use strict';

	$('.w-list-menu').on('click', 'li', function() {
        var th = $(this);
        var h = th.parent();
		$.get('/controls/list_places_weather/'+h.data('list-id')+'/' + th.attr('data-date'), {
			ul: gd.ul,
		}, function(result) {
            h.find('li').removeClass('selected');
			th.addClass('selected');
			h.parent().find('.w-list-content').html(result);
		});
	});
})(jQuery, globalInitData);
