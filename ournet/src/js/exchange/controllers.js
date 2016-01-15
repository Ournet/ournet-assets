angular.module('ournet.controllers', [])
	.controller('GeneralExchangeCtrl', ['$scope', '$compile', 'Http', function($scope, $compile, Http) {
		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};
		$scope.clear = function() {
			$scope.date = null;
		};

		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = !$scope.opened;
		};

		function formatDate(date) {
			if (!date) return '-';
			var s = '';
			try {
				s = new String(date.getFullYear()) + '-';
			} catch (e) {
				return '-';
			}
			var m = date.getMonth() + 1;
			if (m < 10) s += '0';
			s += m + '-';
			var d = date.getDate();
			if (d < 10) s += '0';
			s += d;
			return s;
		}

		$scope.$watch('date', function(newValue, oldValue) {
			if (newValue && formatDate(newValue) != formatDate(oldValue)) {
				Http.get($scope.urlFormat.replace('@date', formatDate(newValue)), {
					success: function(result) {
						var div = document.createElement('div');
						div.innerHTML = result;
						$compile(div)($scope, function(clonedElement) {
							var el = angular.element(document.getElementById('general-exchange-table'));
							el.html('');
							el.append(clonedElement);
						});
					}
				});
			}
		});
	}])
	.controller('MainTableExchangeCtrl', ['$scope', '$timeout', function($scope, $timeout) {

		$scope.value = {};
		$scope.sourceid = 0;
		$scope.refid = 'EUR';
		$scope.refvalue = 10;

		$scope.selectSource = function(id) {
			if (id == $scope.sourceid) return;
			$scope.sourceid = id;
			calcul();
		};

		function calcul() {
			//$scope.value = {};
			var vals = {};
			var refid = $scope.refid;
			var d = $scope.data[$scope.sourceid];
			var found = false;

			var rdata = getDataByCid(d, refid);
			if (rdata == null) return;

			var cnt = $scope.value[refid] || $scope.refvalue;

			angular.forEach(d, function(value, key) {
				if (value.cid == refid) {
					vals[refid] = cnt;
					found = true;
				} else {
					var localval = cnt * rdata.buy;

					var v = localval / value.buy;
					vals[value.cid] = v;
				}
			});
			if (!found) return;
			angular.forEach(vals, function(value, key) {
				$scope.value[key] = value;
			});
			angular.forEach($scope.value, function(value, key) {
				if (!containsKey(vals, key)) $scope.value[key] = 0;
			});
		}

		function getDataByCid(data, cid) {
			var d = null;
			angular.forEach(data, function(value, key) {
				if (value.cid == cid) {
					d = value;
				}
			});
			return d;
		}

		function containsKey(o, k) {
			var exists = false;
			angular.forEach(o, function(value, key) {
				if (key == k) {
					exists = true;
				}
			});
			return exists;
		}

		$scope.focutInput = function(id, e) {
			var el = e.target || e.srcElement;
			$timeout(function() {
				el.select();
			}, 100);
		};

		$scope.changeInput = function(id, e) {
			$scope.refid = id;
			var el = e.target || e.srcElement;
			el = angular.element(el);
			$scope.refvalue = el.val();
			calcul();
		};

		$timeout(calcul, 10);
	}]);
