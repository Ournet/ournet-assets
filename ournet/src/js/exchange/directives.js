angular.module('ournet.directives', [])
    .directive('ourLoading', ['Loading', function(Loading) {
        var obj = {
            restrict: 'A',
            replace: true,
            scope: { },
            template: '<div id="loading" class="hidden"><div class="wrapper"><div class="back"></div><span class="icon"></span></div></div>',
            link: function(scope, ele, attr) {
                scope.hide = function() {
                    ele.addClass('hidden');
                };
                scope.show = function() {
                    ele.removeClass('hidden');
                };
                Loading.init(scope);
            }
        };

        return obj;
    }])
    .directive('ourInformer', ['$timeout', 'Informer', function($timeout, Informer) {
        var obj = {
            restrict: 'A',
            replace: true,
            scope: { },
            template: '<div id="informer" ng-class={hidden:!active}><div id="informer-msg" class="fade {{typeclass}}" ng-class="{in:active}"><span class="icon msg-icon"></span><span class="msg">{{message}}</span><span ng-click="hide()" class="icon close-icon">&times;</span></div></div>',
            link: function(scope, ele, attr) {

                var t = null;

                scope.active = false;

                scope.hide = function() {
                    scope.active = false;
                    $timeout.cancel(t);
                };
                scope.show = function(info) {
                    scope.message = info.message;
                    scope.type = info.type;
                    scope.typeclass = 'type-' + scope.type;
                    scope.active = true;
                    $timeout.cancel(t);
                    t = $timeout(scope.hide, 5 * 1000);
                };
                Informer.init(scope);
            }
        };

        return obj;
    }])
    .directive('ourLoginLink', ['Dialog', function(Dialog) {
        var obj = {
            restrict: 'AC',
            scope: false,
            link: function(scope, ele, attr) {
                ele.bind("click", function(event) {
                    Dialog.login();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                });
            }
        };

        return obj;
    }])
    .directive('currencyInput', ['$filter', '$browser', '$locale', function($filter, $browser, $locale) {
        return {
            require: 'ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var reg = new RegExp(($locale.NUMBER_FORMATS.GROUP_SEP=='.'? '\\':'') + $locale.NUMBER_FORMATS.GROUP_SEP, 'g')
                var listener = function () {
                    var iv = $element.val();
                    var value = $element.val().replace(reg, '')
                    if (iv != value) {
                        $element.val($filter('number')(value, getExt(value)))
                    }
                }

                function getExt(value) {
                    var ext = 2;
                    return ext;
                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function(viewValue) {
                    return viewValue.replace(reg, '');
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    var iv = $element.val();
                    var value = $filter('number')(ngModelCtrl.$viewValue, getExt(ngModelCtrl.$viewValue));
                    if (iv != value)$element.val(value)
                }

                $element.bind('change', listener)
                $element.bind('keydown', function(event) {
                    var key = event.keyCode
                    // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                    // This lets us support copy and paste too
                    if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                        return
                    }
                    if ((57 < key || key < 48)&&key!=8&&key!=46) {
                        event.stopPropagation();
                        event.preventDefault();
                        return
                    }
                    $browser.defer(listener) // Have to do this or changes don't get picked up properly
                })

                $element.bind('paste cut', function() {
                    $browser.defer(listener)
                })
            }
        }
    }])
    .directive('ourDialog', ['$compile', '$timeout', 'Dialog', function($compile, $timeout, Dialog) {
        var obj = {
            restrict: 'A',
            replace: true,
            scope: { },
            template: '<div class="hidden"><div id="dialog-block-ui"></div><div id="dialog" class="fade" ng-class="{in:opened}"><div id="dialog-wrapper"><span id="dialog-close-btn" ng-click="close();" class="close-icon">&times;</span><div id="dialog-content" class="clearfix"></div></div></div></div>',
            link: function(scope, ele, attr) {

                scope.opened = false;

                var dc = document.getElementById('dialog-content');
                dc = angular.element(dc);

                scope.close = function() {
                    ele.addClass('hidden');
                    dc.html('');
                    scope.opened = false;
                };
                scope.show = function() {
                    ele.removeClass('hidden');
                    $timeout(function() {
                        scope.opened = true;
                    });
                };
                scope.set_content = function(content) {
                    dc.html('');
                    var div = document.createElement('div');
                    div.innerHTML = content;
                    $compile(div)(scope, function(clonedElement) {
                        dc.append(clonedElement);
                    });
                };
                Dialog.init(scope);
            }
        };

        return obj;
    }]);