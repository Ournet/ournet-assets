angular.module('our.services', []).
	factory('Cookie', function() {
		return {
			set: function(cookieName, value, msToExpire, path, domain, secure) {
				var expiryDate = new Date();
				if (msToExpire) {
					expiryDate = new Date();
					expiryDate.setTime(expiryDate.getTime() + msToExpire);
				}
				document.cookie = cookieName + '=' + encodeURIComponent(value) + (msToExpire ? ';expires=' + expiryDate.toGMTString() : '') + ';path=' + (path ? path : '/') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
			},

			get: function(cookieName) {
				var cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'), cookieMatch = cookiePattern.exec(document.cookie);
				return cookieMatch ? decodeURIComponent(cookieMatch[2]) : 0;
			}
		};
	})
	.factory('Popup', function() {

		return {
			popup: function(data) {
				//{url,w;h};
				if (typeof data == "undefined" || typeof data.url == "undefined") return;

				data.w = data.w || 500;
				data.h = data.h || 400;

				var left = (window.screen.width - data.w) / 2;
				var top = (window.screen.height - data.h) / 2;
				var w = window.open(data.url, 'name', 'height=' + data.h + ',width=' + data.w + ',left=' + left + ',top=' + top);
				if (window.focus) {
					w.focus();
				}
			}
		};
	})
	.factory('Facebook', function() {

		var inited = false;
		var installing = false;
		var initCbs = [];

		window.fbAsyncInit = function() {
			// init the FB JS SDK
			FB.init({
				appId: globalInitData.FB.appid,
				status: false,
				xfbml: false,
				cookie: true
			});
			installing = false;
			inited = true;
			for (var i in initCbs) {
				initCbs[i]();
			}
		};

		var install = function() {
			installing = true;
			(function() {
				// If we've already installed the SDK, we're done
				if (document.getElementById('facebook-jssdk')) {
					return;
				}

				// Get the first script element, which we'll use to find the parent node
				var firstScriptElement = document.getElementsByTagName('script')[0];

				// Create a new script element and set its id
				var facebookJS = document.createElement('script');
				facebookJS.id = 'facebook-jssdk';

				// Set the new script's source to the source of the Facebook JS SDK
				facebookJS.src = '//connect.facebook.net/en_US/all.js';

				// Insert the Facebook JS SDK into the DOM
				firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
			}());
		};

		return {
			init: function(cb) {
				if (inited) {
					if (cb) cb();
				} else {
					if (cb) initCbs.push(cb);
					if (!installing) {
						install();
					}
				}
			}
		};
	})
	.factory('Analytics', function() {

		var event = function(data) {
			if (typeof _gaq != "undefined") {
				_gaq.push(['_trackEvent', data.category, data.action, data.label, data.value]);
			}
			if (typeof ga != "undefined") {
				ga('send', 'event', data.category, data.action, data.label, data.value);
			}
		};
		var social = function(data) {
			if (typeof _gaq != "undefined") {
				_gaq.push(['_trackSocial', data.network, data.action, data.url]);
			}

			if (typeof ga != "undefined") {
				data.url = data.url || document.location.href;
				ga('send', 'social', data.network, data.action, data.url);
			}
		};


		return {
			event: event,
			eventLogin: function(data) {
				data.category = 'login';
				event(data);
			},
			eventComment: function(data) {
				data.category = 'comment';
				event(data);
			},
			eventVote: function(data) {
				data.category = 'vote';
				event(data);
			},
			eventSocial: function(data) {
				data.category = 'social';
				event(data);
			},
			social: social,
			socialShare: function(data) {
				data.action = 'share';
				social(data);
			}
		};
	});