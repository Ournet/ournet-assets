angular.module('ournet.services', [])

.value('version', '0.1')

.factory('Loading', function() {

	var loading;

	return {
		init: function(aloading) {
			loading = aloading;
		},

		show: function() {
			loading.show();
		},
		hide: function() {
			loading.hide();
		}
	};
})

.factory('Informer', function() {

	var instance;

	return {
		init: function(ainstance) {
			instance = ainstance;
		},

		show: function(info) {
			instance.show(info);
		},
		hide: function() {
			instance.hide();
		}
	};
})

.factory('Config', function() {

	var data = globalInitData;

	return data;
})

.factory('Http', ['$http', 'Loading', 'Config', 'Informer', function($http, Loading, Config, Informer) {

	function processAction(action) {
		switch (action.name) {
			case 'redirect':
				var url = location;
				if (action.data) url = action.data;
				location.replace(url);
				break;
			case 'reload':
				location.replace(location);
				break;
			case 'dialog':
				//if (action.data) Dialog.load(action.data);
				break;
		}
	}


	var request = function(url, method, config) {
		var conf = {};
		conf.url = url;
		conf.method = method.toUpperCase();
		conf.responseType = config.type || "";

		var data = {
			ajaxcall: true,
			ul: Config.ul
		};
		angular.extend(data, config.params);

		conf.params = data;
		conf.data = config.data;

		var noloading = config.noloading || false;
		if (!noloading) Loading.show();

		$http(conf)
			.success(function(result, status) {
				if (!noloading) Loading.hide();
				if (config.success) config.success(result, status);
				if (result && typeof(result) == "object") {
					if (result.action) {
						processAction(result.action);
					}
					if (result.info) {
						Informer.show(result.info);
					}
				}
			})
			.error(function(result, status) {
				if (!noloading) Loading.hide();
				if (config.error) config.error(result, status);
			});
	};

	return {
		request: request,

		get: function(url, config) {
			request(url, 'GET', config);
		},
		post: function(url, config) {
			request(url, 'POST', config);
		},

		processAction: processAction
	};
}])

.factory('Dialog', ['Http', 'Config', function(Http, Config) {

	var dialog;
	var close = function() {
		dialog.close();
	};
	var show = function() {
		dialog.show();
	};

	var load = function(url, data, cb) {
		if (!url) return;
		if (typeof data == 'function') {
			cb = data;
			data = null;
		}
		data = data || {};
		var settings = {
			viewshowtitle: true,
			ajaxcall: true,
			dialogcall: true
		};

		if (data) {
			angular.extend(settings, data);
		}

		close();

		if (url) {

			Http.get(url, {
				params: settings,
				success: function(result) {
					if (typeof result == 'object') {
						//UI.processAjaxResult(result);
					} else {
						if (result && result != '') {
							dialog.set_content(result);
							show();
						}
					}
					if (cb) cb();
				}
			});
		}
	};

	return {
		init: function(adialog) {
			dialog = adialog;
		},

		show: show,
		close: close,

		login: function(cb) {
			load('/accounts/controls/AuthThirdParty', cb);
		},

		isLogged: function(cb) {
			if (Config.userIsLogged) return true;

			this.login(cb);

			return false;
		},

		load: load
	};
}]);
