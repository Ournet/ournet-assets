(function ($w, $d) {
    OURNET = $w.OURNET || {};

    function getAttr(ele, attr) {
        var result = (ele.getAttribute && ele.getAttribute(attr)) || null;
        if (!result) {
            var attrs = ele.attributes;
            var length = attrs.length;
            for (var i = 0; i < length; i++) {
                if (attrs[i].nodeName === attr) {
                    result = attrs[i].nodeValue;
                }
            }
        }
        return result;
    }

    function setAttr(ele, name, value) {
        try {
            ele.setAttribute(name, value);
        } catch (e) { }
    }

    function getElementsByClassname(className, tagName, node) {
        "use strict";
        node = node ? node : $d;
        tagName = tagName ? tagName : "*";

        if ($d.getElementsByClassName) {
            // If browser supports this function, use it.
            return node.getElementsByClassName(className);
        } else {
            // If the browser doesn't support the function, use custom test
            var allElems = node.getElementsByTagName(tagName),
                allElemsLength = allElems.length,
                elemList = [], //will be converted to NodeList when populated
                i = 0,
                currentElem;

            for (i; i < allElemsLength; i += 1) {
                currentElem = allElems[i];

                if (currentElem.className.search(className) !== -1) {
                    elemList.push(currentElem);
                }
            }

            return elemList;
        }
    }

    function addClass(element, className) {
        var currentClassName = element.getAttribute("class");
        if (typeof currentClassName !== "undefined" && currentClassName) {
            element.setAttribute("class", currentClassName + " " + className);
        }
        else {
            element.setAttribute("class", className);
        }
    }
    function removeClass(element, className) {
        var currentClassName = element.getAttribute("class");
        if (typeof currentClassName !== "undefined" && currentClassName) {

            var class2RemoveIndex = currentClassName.indexOf(className);
            if (class2RemoveIndex != -1) {
                var class2Remove = currentClassName.substr(class2RemoveIndex, className.length);
                var updatedClassName = currentClassName.replace(class2Remove, "").trim();
                element.setAttribute("class", updatedClassName);
            }
        }
        else {
            element.removeAttribute("class");
        }
    }

    function insertScript(url) {
        var head = $d.getElementsByTagName('head')[0];
        var ins = $d.createElement('script');
        ins.async = 1;
        ins.src = url;
        head.appendChild(ins);
    }

    OURNET.dom = {
        getAttr: getAttr,
        setAttr: setAttr,
        getElementsByClassname: getElementsByClassname,
        insertScript: insertScript,
        addClass: addClass,
        removeClass: removeClass
    };
})(window, document);