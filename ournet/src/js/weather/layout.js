(function(d, w, appear) {

	function appearEnable() {
		appear({
			init: function init() {
				// console.log('dom is ready');
			},
			elements: function elements() {
				// work with all elements with the class "track"
				return [document.getElementById('content-bottom')];
			},
			appear: function appear(el) {
				// console.log('visible', el);
				$('head').append('<link type="text/css" rel="stylesheet" href="http://assets.ournetcdn.net/ournet/css/zodiac-signs.min.css">');
			},
			disappear: function disappear(el) {
				// console.log('no longer visible', el);
			},
			bounds: 200,
			reappear: false
		});
	}

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
		appearEnable();
		// affixEnable();
	});
})(document, window, appear);
