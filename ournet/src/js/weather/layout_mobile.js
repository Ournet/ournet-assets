(function(d, w) {

	function searchEnable() {
		$('#search-btn').click(function() {
			$('#q-form').submit();
		});
	}

	$(d).ready(function() {
		searchEnable();
	});
})(document, window);
