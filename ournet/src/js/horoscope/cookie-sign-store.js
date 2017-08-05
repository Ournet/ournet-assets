/**
 * CookieHoroscopeSignStore function
 */
(function ($w, $cookie) {
    OURNET = $w.OURNET || {};
    OURNET.horo = OURNET.horo || {};

    OURNET.horo.CookieHoroscopeSignStore = function (options) {
        options = options || {};
        var name = options.name || 'usr-horo-sign';
        var domain = options.domain;
        var msToExpire = options.msToExpire || 1000 * 60 * 60 * 24 * 360 * 1;
        var path = options.path;
        return {
            save: function (sign) {
                // one year
                $cookie.set(name, sign, msToExpire, path, domain);
            },
            get: function () {
                return $cookie.get(name);
            }
        };
    }

})(window, OURNET.util.Cookie);
