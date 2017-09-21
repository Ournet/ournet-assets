(function(d, w) {

	function searchEnable() {
		$('#search-btn').click(function() {
			$('#q-form').submit();
		});
	}

	function lazyEnable() {
		$('img.lazy').lazyload({ effect: 'fadeIn' });
	}

	function socialLikes() {
		// $('.social-likes').socialLikes();
		// $(d).on('popup_opened.social-likes', function(event, service) {
		// 	ga('send', 'event', 'social', 'share', service);
		// });
	}

	$(d).ready(function() {
		searchEnable();
		lazyEnable();
		socialLikes();
	});
})(document, window);
