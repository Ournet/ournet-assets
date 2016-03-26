(function(d, w) {

	function searchEnable() {
		$('#search-btn').click(function() {
			$('#q-form').submit();
		});
	}

	function lazyEnable() {
		$('img.lazy').lazyload({ effect: 'fadeIn' });
	}

	$(d).ready(function() {
		searchEnable();
		lazyEnable();
	});
})(document, window);
