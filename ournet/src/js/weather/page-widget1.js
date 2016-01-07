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
		var days = $('#conf_days').val();
		var bcolor = $('#conf_bcolor').val();
		var bkcolor = $('#conf_bkcolor').val();
		var hbkcolor = $('#conf_hbkcolor').val();
		var htcolor = $('#conf_htcolor').val();
		var lcolor = $('#conf_lcolor').val();
		var w = $('#conf_w').val();
		var data = {
			id: $('#conf_placeid').val(),
			ul: gd.ul,
			cn: gd.cn,
			days: days,
			bcolor: bcolor,
			bkcolor: bkcolor,
			hbkcolor: hbkcolor,
			htcolor: htcolor,
			lcolor: lcolor,
			w: w
		};
		$.get('/widget/widget_script', data, function(result) {
			$('#weather-iframe').html(result);
			$('#weather-script').val(result);
		});
	}

	$('#conf_generate').click(generate);

	generate();
})(jQuery, globalInitData);
