(function(d) {
	function enable() {
		// details head
		$('.wt-head').click(function() {
			var details = $(this).parent();
			var summary = details.prev();
			summary.removeClass('closed');
			// $('.report-summary.closed', body)
			// 	.each(function() {
			// 		$(this).removeClass('closed');
			// 	});
			details.removeClass('opened');
		});

		// symmary
		$('.report-summary').click(function() {
			var summary = $(this);
			var details = summary.next();
			summary.addClass('closed')
			details.addClass('opened');
		});
	}

	$(d).ready(function() {
		enable();
	});
})(document);
