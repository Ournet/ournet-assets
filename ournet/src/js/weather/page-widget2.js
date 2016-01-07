(function($, gd) {
	$('#conf_place').autocomplete('controls/findplace', {
		minChars: 3,
		selectFirst: true,
		scrollHeight: 320,
		autoFill: false,
		params: {
			ul: gd.ul
		},
		formatItem: function(data, i, max, value) {
			var txt = '<strong>' + data.name + '</strong><div>' + data.region.name + '</div>';
			return txt;
		},
		parse: function(data) {
			return $.map(data, function(row) {
				return {
					data: row,
					value: new String(row.id),
					result: row.name
				}
			});
		}
	}, 'json').result(function(event, data, e2) {
		$('#conf_placeid').val(data.id);
	});

	function generate() {
		var data = {
			id: $('#conf_placeid').val(),
			ul: gd.ul,
			cn: gd.cn,
			days: $('#conf_days').val(),
			color: $('#conf_color').val(),
			itemcolor: $('#conf_itemcolor').val(),
			textcolor: $('#conf_textcolor').val(),
			pos: $('#conf_pos').val(),
			w: $('#conf_w').val(),
			header: $('#conf_header').prop('checked')
		};
		$.get('/widget2/widget_html_script', data, function(result) {
			$('#weather-iframe').html(result);
			$('#weather-script').val(result);
		});
	}

	$('#conf_generate').click(generate);

	generate();
})(jQuery, globalInitData);