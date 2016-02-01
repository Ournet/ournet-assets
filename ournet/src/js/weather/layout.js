(function(d, w) {
	$(d).ready(function() {
		var currentScrollTop = 0;
		var pastScrollTop = 0;

		function onChangedScroll() {
			currentScrollTop = $(d).scrollTop();
			if (currentScrollTop === 0 || pastScrollTop === 0 && currentScrollTop >= 0 && currentScrollTop !== pastScrollTop) {
				console.log('aici', currentScrollTop, pastScrollTop);
				if (currentScrollTop > 0) {
					$('#page-header').addClass('active');
				} else {
					$('#page-header').removeClass('active');
				}
				pastScrollTop = currentScrollTop;
			}
		}
		$(w).scroll(onChangedScroll);

		onChangedScroll();
	});
})(document, window);
