(function(d, w) {
	// function lazyEnable() {
	// 	$('img.lazy').lazyload({ effect: 'fadeIn' });
	// }

	function socialLikes() {
		$('.social-likes').socialLikes();
		$(d).on('popup_opened.social-likes', function(event, service) {
			ga('send', 'event', 'social', 'share', service);
		});
	}

	$(d).ready(function() {
		// lazyEnable();
		socialLikes();
	});
})(document, window);
