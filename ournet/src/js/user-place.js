(function ($w, $d, $, $ck) {
    OURNET = $w.OURNET || {};
    OURNET.UserPlace = {
        addFavPlace: addFavPlace,
        getFavPlaces: getFavPlaces,
        addVisitedPlace: addVisitedPlace,
        getVisitedPlaces: getVisitedPlaces,
        loadUserPlaceWeather: loadUserPlaceWeather
    };

    var FAV_ID = 'fav_ps';
    var FAV_LIMIT = 10;
    var VISITED_ID = 'vis_ps';
    var VISITED_LIMIT = 5;

    function getDomain() { return $w.location.hostname.toLowerCase().trim(); }
    function map(list, fn) {
        var l2 = [];
        for (var i = 0; i < list.length; i++) {
            l2.push(fn(list[i], i));
        }

        return l2;
    }

    function uniqIds(list, fn) {
        if (!list || !list.length) {
            return []
        }
        var c = {};
        for (var i = 0; i < list.length; i++) {
            if (typeof list[i] === 'string' && list[i].trim().length > 0) {
                c[list[i].trim()] = i;
            }
        }
        list = [];

        for (var prop in c) {
            if (fn) {
                list.push(fn(prop));
            }
            else {
                list.push(prop);
            }
        }

        return list;
    }

    function saveFav(value, domain) {
        // 1 year
        $ck.set(FAV_ID, value, 31556926 * 1000 * 1, null, domain);
    }

    function saveVisited(value, domain) {
        // 1 year
        $ck.set(VISITED_ID, value, 31556926 * 1000 * 1, null, domain);
    }

    function addFavPlace(placeId, domain) {
        if (typeof placeId !== 'number') {
            throw new Error('`placeId` must be a number!');
        }
        var ids = getFavPlaces();
        if (ids.indexOf(placeId) < 0) {
            ids.unshift(placeId);
        }

        if (ids.length > FAV_LIMIT) {
            ids = ids.slice(0, FAV_LIMIT);
        }

        ids = ids.join(',');

        saveFav(ids, domain);
    }
    function getFavPlaces() {
        var ids = $ck.get(FAV_ID);
        if (ids && typeof ids === 'string' && ids.trim().length > 1) {
            ids = uniqIds(ids.trim().split(/,/g), parseInt);
            if (ids.length > FAV_LIMIT) {
                ids = ids.slice(0, FAV_LIMIT);
            }
        } else {
            ids = [];
        }

        return ids;
    }

    function addVisitedPlace(placeId) {
        if (typeof placeId !== 'number') {
            throw new Error('`placeId` must be a number!');
        }

        var values = getVisitedPlacesValues();
        var index = -1;
        for (var i = 0; i < values.length; i++) {
            if (placeId === values[i][0]) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            values[index][1]++;
        }
    }

    function getVisitedPlaces() {
        var values = getVisitedPlacesValues();
        var ids = map(values, function (item) {
            return item[0];
        });

        return ids;
    }

    /**
     * Returns: [[id, rating]]; sorted
     */
    function getVisitedPlacesValues() {
        var ids = $ck.get(VISITED_ID);
        if (ids && typeof ids === 'string' && ids.trim().length > 1) {
            ids = uniqIds(ids.trim().split(/,/g));
            ids = map(ids, function (item) {
                var v = item.split(/:/g);
                return [parseInt(v[0]), parseInt(v[1])];
            });
            ids.sort(function (a, b) { return b[1] - a[1]; });
        } else {
            ids = [];
        }

        return ids;
    }
    function loadUserPlaceWeather(domain, containerId) {
        domain = domain || getDomain();
        containerId = containerId || '#user-place-weather';
    }
})(window, document, $, window.OURNET.util.Cookie);
