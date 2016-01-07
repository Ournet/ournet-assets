/**
* Cookies utility
* --- No dependencies
*/

(function() {
  'use strict';

function encode(str){
  return str;
}
function decode(str){
  return str;
}

  var Cookies = {

    set: function(cookieName, value, msToExpire, path, domain, secure) {
      var expiryDate = new Date();
      if (msToExpire) {
        expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + msToExpire);
      }
      document.cookie = cookieName + '=' + encode(value) + (msToExpire ? ';expires=' + expiryDate.toGMTString() : '') + ';path=' + (path ? path : '/') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    },

    get: function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decode(c.substring(nameEQ.length, c.length));
      }
      return null;
    },

    erase: function(name) {
      Cookies.set(name, "", -1);
    },

    remove: function(name) {
      Cookies.erase(name);
    }
  };

  window.Cookies = Cookies;

})();