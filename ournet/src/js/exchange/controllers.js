angular.module('ournet.controllers', [])
    .controller('Auth3ListCtrl', ['$scope', 'Facebook', 'Analytics', function($scope, Facebook, Analytics) {

        Facebook.init();

        $scope.init = function(returnurl, provs) {
            $scope.returnurl = returnurl;
            $scope.provs = provs;
            Analytics.eventLogin({ action: 'init-login-dialog', label: 'provider login' });
        };

        $scope.clickLogin = function(provider) {
            Analytics.eventLogin({ action: 'click-login', label: provider });
            var url = $scope.provs[provider];
            if (provider == 'facebook') {
                FB.login(function(response) {
                    if (response.authResponse) {
                        var c = '?';
                        c = url.indexOf(c) > -1 ? '&' : c;
                        var u = url + c + 'AccessToken=' + response.authResponse.accessToken;
                        location.replace(u);
                    } else {

                    }
                }, { scope: 'email' });
                return false;
            }

            var left = (window.screen.width - 500) / 2;
            var top = (window.screen.height - 500) / 2;
            var newwindow = window.open(url, 'name', 'height=500,width=500,left=' + left + ',top=' + top);
            if (window.focus) {
                newwindow.focus();
            }

            return false;
        };
    }])
    .controller('GeneralExchangeCtrl', ['$scope', '$compile', 'Http', function ($scope, $compile, Http) {
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
            } catch(e) {
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
                Http.get('/controls/GeneralExchangeTable', {
                    params: { date: formatDate(newValue) },
                    success: function (result) {
                        var div = document.createElement('div');
                        div.innerHTML = result;
                        $compile(div)($scope, function (clonedElement) {
                            var el = angular.element(document.getElementById('general-exchange-table'));
                            el.html('');
                            el.append(clonedElement);
                        });
                    }
                });
            }
        });
    }])
    .controller('MainTableExchangeCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        $scope.value = { };
        $scope.sourceid = 0;
        $scope.refid = 'EUR';
        $scope.refvalue = 10;

        $scope.selectSource = function (id) {
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

            var rdata = getDataByCid(d,refid);
            if (rdata == null) return;

            var cnt = $scope.value[refid] || $scope.refvalue;

            angular.forEach(d, function (value, key) {
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
            angular.forEach(vals, function (value, key) {
                $scope.value[key] = value;
            });
            angular.forEach($scope.value, function (value, key) {
                if (!containsKey(vals, key)) $scope.value[key] = 0;
            });
        }
        
        function getDataByCid(data, cid) {
            var d = null;
            angular.forEach(data, function (value, key) {
                if (value.cid == cid) {d = value;}
            });
            return d;
        }
        
        function containsKey(o, k) {
            var exists = false;
            angular.forEach(o, function (value, key) {
                if (key == k) {
                    exists = true;
                }
            });
            return exists;
        }

        $scope.focutInput = function(id,e) {
            var el = e.target || e.srcElement;
            $timeout(function() {
                el.select();
            }, 100);
        };

        $scope.changeInput = function (id, e) {
            console.log(id);
            $scope.refid = id;
            var el = e.target || e.srcElement;
            el = angular.element(el);
            $scope.refvalue = el.val();
            calcul();
        };

        $timeout(calcul, 10);
    }]);