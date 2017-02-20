(function(d, w, appear) {

	function appearEnable() {
		appear({
			init: function init() {
				// console.log('dom is ready');
			},
			elements: function elements() {
				// work with all elements with the class "track"
				return [document.getElementById('appear-horoscope')];
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

	function lazyEnable() {
		$('img.lazy').lazyload({ effect: 'fadeIn' });
	}

	$(d).ready(function() {
		lazyEnable();
		appearEnable();
	});
})(document, window, appear);
