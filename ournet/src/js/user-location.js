(function(w, Cookie) {
	'use strict';

	var name = 'usrloc';

	function sendGAEvent(action, label) {
		ga('send', 'event', name, action, label);
	}

	function call(url, cb) {
		$.getJSON(url).done(cb)
			.fail(function(error) {
				sendGAEvent('error', error && error.message || url);
			});
	}

	// function getIP(cb) {
	// 	call('https://api.ipify.org?format=json', cb);
	// }

	function getLocation(cb) {
		call('http://ip-api.com/json', function(data) {
			if (data && data.query && data.status) {
				data = {
					ip: data.query,
					lat: data.lat,
					lng: data.lon
				};
			}
			cb(data);
		});
	}

	function getPlace(loc, cb) {
		call('http://api.geonames.org/findNearbyPlaceNameJSON?lat=' + loc.lat + '&lng=' + loc.lng + '&username=Dumitru', function(data) {
			data = data && data.geonames && data.geonames[0] || null;
			cb(data);
		});
	}

	function get() {
		var data = Cookie.get(name);
		if (typeof data === 'string') {
			return data.split(/;/g);
		}

		return null;
	}

	function save(loc, place) {
		var data = [loc.ip, [loc.lat, loc.lng].join(','), place.countryCode, place.geonameId];
		sendGAEvent('save', data.join(';'));
		var domain = w.location.hostname.split(/\./g).slice(-2).join('.');
		domain = domain !== 'localhost' ? '.' + domain : domain;
		// 90 days
		Cookie.set(name, data.join(';'), 1000 * 86400 * 90, '/', domain);
		return data;
	}

	function set(cb) {
		var data = get();
		if (data && data.length > 0) {
			return cb(data);
			// sendGAEvent('data-exists', data.join(';'));
		}

		getLocation(function(loc) {
			if (!loc || !loc.ip) {
				sendGAEvent('no-location', loc && loc.message || null);
				return cb();
			}

			getPlace(loc, function(place) {
				if (!place || !place.geonameId) {
					sendGAEvent('no-place', [loc.lat, loc.lng].join(','));
					return cb();
				}
				cb(save(loc, place));
			});
		});
	}

	w.userLocation = {
		get: function(cb) {
			cb = cb || function() {};
			try {
				return set(cb);
			} catch (error) {
				sendGAEvent('error', error.message);
				cb();
			}
		}
	};
})(window, Cookie);
