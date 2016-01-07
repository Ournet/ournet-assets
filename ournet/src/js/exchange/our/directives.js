angular.module('our.directives', ['our.services'])
	.controller('SharedataController', ['$scope', '$element', '$http', '$timeout', 'Popup', function SharedataCtrl($scope, $element, $http, $timeout, Popup) {

		var ctrl = this;

		ctrl.share = function(data) {
			Popup.popup({ url: data.url });
		};
	}])
	.directive('ourSharedata', function() {

		var obj = {
			restrict: 'EAC',
			controller: 'SharedataController',
			scope: {
				appname: '@',
				identifier: '@',
				title: '@',
				cid: '@',
				view: '@'
			}
		};

		return obj;
	})
	.directive('ourShareItem', function() {
		var obj = {
			restrict: 'EAC',
			require: '^ourSharedata',
			scope: {
				service: '@',
				url: '@href'
			},
			link: function(scope, el, attr, sharedataCtrl) {
				scope.sending = false;
				el.bind("click", function(event) {
					event.preventDefault();
					event.stopPropagation();
					sharedataCtrl.share(scope);
					return false;
				});
			}
		};

		return obj;
	})
	.directive('ourTabableContent', ['$timeout', function($timeout) {
		var obj = {
			restrict: 'EAC',
			replace: false,
			scope: { },
			link: function(scope, el, attr) {
				var $element = angular.element;

				var active = 'active';
				var inClass = 'in';

				scope.activeid = null;
				scope.activetab = null;

				function onClickTab(tab) {
					var id = tab.attr('href').substring(1);
					if (scope.activeid == id) return;

					var content = $element(document.getElementById(id));

					if (content.length == 0) {
						console.log('no content with id=' + id);
						return;
					}

					var oldcontent = $element(document.getElementById(scope.activeid));
					oldcontent.removeClass(active);
					oldcontent.removeClass(inClass);
					scope.activetab.parent().removeClass(active);

					content.addClass(active);
					$timeout(function() {
						content.addClass(inClass);
					});
					tab.parent().addClass(active);

					scope.activeid = id;
					scope.activetab = tab;
				}

				function bindNav() {
					var navs = el.find('ul');
					var stop = false;
					angular.forEach(navs, function(nav) {
						if (stop) return;
						nav = $element(nav);
						if (nav.hasClass('nav')) {
							stop = true;
							var links = nav.find('a');
							angular.forEach(links, function(link) {
								link = $element(link);
								var id = link.attr('href').substring(1);
								link.bind('click', function(event) {
									event.preventDefault();
									event.stopPropagation();
									onClickTab(link);
									return false;
								});
								if (link.parent().hasClass(active)) {
									scope.activeid = id;
									scope.activetab = link;
								}
							});
						}
					});
				}

				bindNav();
			}
		};

		return obj;
	}]);