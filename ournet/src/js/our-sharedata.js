+function($,popup,cookie) {
	var controls = $('.our-sharedata');
	if(controls.length==0) return;
	var ids = new Array();
	var app = null;
	$.each(controls, function(i) {
		var c = $(controls[i]);
		app = app || c.attr('data-appname');
		var id = c.attr('data-identifier');
		var exists = false;
		for (var j in ids) {
			if (ids[j] == id) {
				exists = true;
				break;
			}
		}
		if (!exists) ids.push(id);
		
		var item = $(".our-share-item", c);
		item.on('click', function () {
			var it = $(this);
			share({ appname: app, identifier: id, servicename: it.attr('data-service'), itemname: c.attr('data-title'), cid: c.attr('data-cid'), url: it.attr('href') });
		});
	});

	$.each(ids, function(i) {
		var id = ids[i];
		getItemData({ appname: app, identifier: id }, function(result) {
			if (!result) return;
			var sum = 0;
			for (var s in result) {
				sum += result[s];
			}
			if (sum == 0) return;
			$.each(controls, function(j) {
				var c = $(controls[j]);
				if(c.attr('data-identifier')==id) {
					var view = c.attr('data-view');
					if(view=='sum') {
						var item = $('.share-count', c);
						item.text(sum);
						item.addClass('fade');
						item.removeClass('hidden');
						item.addClass('in');
					}else {
						for (var svc in result) {
							var item = $(".our-share-item[data-service='"+svc+"'] .share-count", c);
							item.text(result[svc]);
							item.addClass('fade');
							item.removeClass('hidden');
							item.addClass('in');
						}
					}
				}
			});
		});
	});

	function share(data) {
		Popup.popup({ url: data.url });

		var cookname = 'SD-' + data.cid;
		var value = '_' + data.servicename;
		var cook = Cookie.get(cookname);
		if (cook && cook.toString().indexOf(value) > -1) {
			return;
		}
		
		setItemData({ appname: data.appname, identifier: data.identifier, servicename: data.servicename, itemname: data.itemname });
		
		if (cook) {
			cook = cook + value;
		} else {
			cook = value;
		}
		Cookie.set(cookname, cook, 1000 * 60 * 60 * 24 * 30);
	}

	function getItemData(data,cb) {
		$.get('http://sharedata.oursvc.net/api/getitemdata', data, function(result) {
			if(cb) cb(result);
		});
	}
	function setItemData(data,cb) {
		$.post('http://sharedata.oursvc.net/api/shareitem', data, function(result) {
			if(cb) cb(result);
		});
	}
	
}(jQuery, Popup, Cookie);