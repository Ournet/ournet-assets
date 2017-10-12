(function ($w, $d) {
    OURNET = $w.OURNET || {};
    OURNET.Counters = {
        init: initCounters
    };

    function initCounters(country, project) {
        // console.log('initCounters', country, project)
        if (country === 'ru') {
            initRambler(project);
        }
    }
    function initRambler(projectId) {
        var project = { news: 2601709, portal: 2677032, weather: 4509755, horoscope: 4509759 }[projectId];
        // console.log('initRambler')
        var w = $w, d = $d, c = '_top100q';
        (w[c] = w[c] || []).push(function () {
            var options = {
                project: project
            };
            try {
                w.top100Counter = new top100(options);
            } catch (e) {
                // console.log(e)
            }
        });
        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () {
                // console.log('in f')
                n.parentNode.insertBefore(s, n);
            };
        s.type = "text/javascript";
        s.async = true;
        s.src =
            (d.location.protocol == "https:" ? "https:" : "http:") +
            "//st.top100.ru/top100/top100.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    }
})(window, document);
