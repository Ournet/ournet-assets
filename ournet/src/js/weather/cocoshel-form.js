(function ($, d) {

	function isEmail(email) {
		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
	}

	$.fn.cocoshel = function () {
		this.each(function () {
			// console.log('cocoshel', this);
			var cocoshelEl = $(this);
			var url = cocoshelEl.attr('data-url');
			// console.log('url', url);

			var buttonEl = cocoshelEl.find('.cocoshel-button');
			var emailEl = cocoshelEl.find('.cocoshel-email');
			var titleEl = cocoshelEl.find('.cocoshel-title');

			function onClick() {
				var data = {};

				cocoshelEl.find('.cocoshel-inputs input')
					.each(function () {
						var el = $(this);
						data[el.attr('name')] = el.val();
					});


				if (!isEmail(data.email)) {
					console.log('invalid email', data.email);
					return false;
				}

				// console.log('data', data, url);


				$.ajax({
					type: 'POST',
					url: url,
					data: data,
					success: function (response) {
						titleEl.removeClass('error');
						titleEl.addClass('success');
						// if (response && response.message) {
						// 	titleEl.html(response.message);
						// }
						emailEl.val('');
						cocoshelEl.slideUp();
						ga('send', 'event', 'newsletter', 'subscribe', data.email.toLowerCase());
					},
					dataType: 'json'
				});
			}

			buttonEl.click(onClick);
			emailEl.keypress(function (e) {
				if (e.which === 13) {
					return onClick();
				}
			});
		});
		return this;
	};

	$(d).ready(function () {
		$('.cocoshelform').cocoshel();
	});

}(jQuery, document));
