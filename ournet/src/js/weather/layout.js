(function(d, w) {

	function searchEnable() {
		$('#search-btn').click(function() {
			$('#q-form').submit();
		});
	}

	function scrollEnable() {
		var currentScrollTop = 0;
		var pastScrollTop = 0;

		function onChangedScroll() {
			currentScrollTop = $(d).scrollTop();
			if (currentScrollTop === 0 || pastScrollTop === 0 && currentScrollTop >= 0 && currentScrollTop !== pastScrollTop) {
				console.log('aici', currentScrollTop, pastScrollTop);
				if (currentScrollTop > 0) {
					$('#page-header').removeClass('trans');
					$('#page-header').addClass('solid');
				} else {
					$('#page-header').removeClass('solid');
					$('#page-header').addClass('trans');
				}
				pastScrollTop = currentScrollTop;
			}
		}
		$(w).scroll(onChangedScroll);

		onChangedScroll();
	}

	$(d).ready(function() {
		searchEnable();
		scrollEnable();
	});
})(document, window);
