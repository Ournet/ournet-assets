var Cookie = {
    set: function (cookieName, value, msToExpire, path, domain, secure) {
        var expiryDate = new Date();
        if (msToExpire) {
            expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + msToExpire);
        }
        document.cookie = cookieName + '=' + encodeURIComponent(value) + (msToExpire ? ';expires=' + expiryDate.toGMTString() : '') + ';path=' + (path ? path : '/') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    },

    get: function (cookieName) {
        var cookiePattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'), cookieMatch = cookiePattern.exec(document.cookie);
        return cookieMatch ? decodeURIComponent(cookieMatch[2]) : 0;
    }
};