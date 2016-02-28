(function(d) {
	function enable() {
		// details head
		$('.wt-head').click(function() {
			var details = $(this).parent().parent();
			var summary = details.next();
			summary.removeClass('closed');
			details.slideUp(function() {
				details.removeClass('opened');
				details.attr('style', null);
			});
		});

		// symmary
		$('.report-summary').click(function() {
			var summary = $(this);
			var details = summary.prev();
			summary.addClass('closed');
			details.slideDown(function() {
				details.addClass('opened');
				details.attr('style', null);
			});
		});
	}

	$(d).ready(function() {
		enable();
	});
})(document);
