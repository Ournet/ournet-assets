(function(d, w) {

	function searchEnable() {
		$('#search-btn').click(function() {
			$('#q-form').submit();
		});
	}

	function affixEnable() {
		$('#affix-right-region').affix({
			offset: {
				top: $('#affix-right-region').offset().top - 60,
				bottom: 200
			}
		});
	}

	$(d).ready(function() {
		searchEnable();
		// affixEnable();
	});
})(document, window);
