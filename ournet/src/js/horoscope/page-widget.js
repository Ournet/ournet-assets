(function ($, gd) {

	function getData() {
		var data = {};
		$('#widget-conf .conf-input').each(function () {
			var element = $(this);
			var name = element.attr('name');
			data[name] = element.val();
			if (element.attr('type') === 'checkbox') {
				data[name] = element.prop('checked') === true;
			}
		});
		data.id = $('#widget-conf-placeid').val();
		data.ul = data.ul || gd.ul;
		data.scripttype = $('input[name=scripttype]:checked').val();
		return data;
	}

	$('.form .conf-input').on('blur', generate);

	$('input[name=scripttype]').on('change', generate);

	function generate() {
		var data = getData();
		var type = $('#widget-type').val();
		$.get('/widgets/' + type + '_script', data, function (result) {
			$('#widget-iframe').html(result);
			$('#widget-script').val(result);
		});
	}

	$('#widget-conf-generate').click(generate);

	$('#widget-types .type-item').click(function () {
		var data = $.parseJSON($(this).attr('data-data'));
		for (var prop in data) {
			$('#widget-conf .conf-input[name=' + prop + ']').val(data[prop]);
		}
		generate();
	});

	generate();

	$('.box-tab').click(function () {
		var tab = $(this);
		if (tab.hasClass('active')) {
			return;
		}
		var tabs = tab.closest('.box-tabs');
		var boxSelector = tabs.attr('data-ref');
		tabs.find('.box-tab').each(function (index) {
			var tb = $(this);
			if (tb[0] == tab[0]) {
				$('#widget-type').val('widget' + (index > 0 ? index + 1 : ''));
				tab.addClass('active');
				$(boxSelector).removeAttr('id');
				$(boxSelector).addClass('hidden');
				$(boxSelector).eq(index).attr('id', 'widget-conf');
				$(boxSelector).eq(index).removeClass('hidden');
			} else {
				tb.removeClass('active');
			}
		});

		generate();
	});
})(jQuery, globalInitData);
