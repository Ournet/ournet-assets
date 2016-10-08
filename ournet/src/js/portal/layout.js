(function(d, w) {

	function lazyEnable() {
		$('img.lazy').lazyload({ effect: 'fadeIn' });
	}

	$(d).ready(function() {
		lazyEnable();
	});
})(document, window);
