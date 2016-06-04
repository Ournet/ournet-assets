'use strict';

(function(doc, win, cookies) {

	// id.time.count,id.time.count, etc.
	function deserialize(data) {
		var lines = data.split(/,/g);
		var obj = {};
		for (var i = 0; i < lines.length; i++) {
			var item = lines[i].split(/\./g);
			if (item.length === 3) {
				var o = { id: parseInt(item[0]), time: parseInt(item[1]), count: parseInt(item[2]) };
				if (o.time > (Date.now() / 1000) - 30 * 86400) {
					obj[item[0]] = o;
				}
			}
		}
		return obj;
	}

	// id.time.count,id.time.count, etc.
	function serialize(obj) {
		var data = '';
		var list = [];
		for (var id in obj) {
			list.push(obj[id]);
		}
		list = list.sort(function(a, b) {
			var r = b.count - a.count;
			if (r === 0) {
				return b.time - a.time;
			}
			return r;
		}).slice(0, 3);
		for (var i = 0; i < list.length; i++) {
			data += [list[i].id, list[i].time, list[i].count].join('.');
			if (i < list.length - 1) {
				data += ',';
			}
		}
		return data;
	}

	var UserPlaces = {
		options: { key: 'wplids', expires: 86400 * 60 },
		addPlace: function(id) {
			var data = this.data();
			data[id] = data[id] || { id: parseInt(id), count: 0 };
			data[id].count++;
			data[id].time = parseInt(Date.now() / 1000);
			this.save();
		},
		save: function() {
			var data = serialize(this.data());
			cookies.set(UserPlaces.options.key, data, { domain: UserPlaces.options.domain, expires: UserPlaces.options.expires });
		},
		data: function() {
			if (!this._data) {
				var data = cookies.get(UserPlaces.options.key) || '';
				this._data = deserialize(data);
			}
			return this._data;
		}
	};

	win.UserPlaces = UserPlaces;

})(document, window, Cookies);
