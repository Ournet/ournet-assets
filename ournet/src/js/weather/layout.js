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

	function socialLikes() {
		$('.social-likes').socialLikes();
		$(d).on('popup_opened.social-likes', function(event, service) {
			ga('send', 'event', 'social', 'share', service);
		});
	}

	$(d).ready(function() {
		searchEnable();
		socialLikes();
		// affixEnable();
	});
})(document, window);
