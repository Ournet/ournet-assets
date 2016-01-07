/*  trakerEvent={category:'',action:'',label:'',value:1}    */
(function() {
	var GA = {}

	GA.pushEvent = function(data) {
		try {
			ga('send', 'event', data.category, data.action, data.label, data.value);
		} catch (e) {}
	}
	GA.sendEvent = GA.pushEvent;
	GA.trackSocial = function(data) {
		try {
			ga('send', 'social', data.net, data.name, data.href);
		} catch (e) {}
	}
	GA.sendSocial = GA.trackSocial;
	window.GA = GA;
})();