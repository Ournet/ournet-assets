/*!     Ournet Group
    v0.1        */
(function(widgetClassName) {
  var obj = window.ournetweather || [];
  obj.push = push;
  window.ournetweather = obj;
  var len = obj.length;
  var hosts = {
    ro: 'meteo.ournet.ro',
    md: 'meteo.click.md',
    ru: 'pogoda.zborg.ru',
    'in': 'weather.ournet.in',
    bg: 'vremeto.ournet.bg',
    hu: 'idojaras.ournet.hu',
    ua: 'pogoda.ournet.com.ua',
    it: 'meteo.ournet.it',
    cz: 'pocasi.ournet.cz',
    sk: 'pocasie.ournet.sk',
    by: 'pogoda.ournet.by',
    lt: 'orai.ournet.lt',
    lv: 'laika.ournet.lv',
    mx: 'tiempo.ournet.mx',
    rs: 'vreme.ournet.rs',
    pl: 'pogoda.diez.pl',
    al: 'www.moti2.al',
    tr: 'hava.one'
  };

  function push() {
    len++;
    var ins = getIns();
    createWidget(ins[ins.length - 1]);
  }

  function createInitialWidgets() {
    if (len > 0) {
      var ins = getIns();
      for (var i = 0; i < len; i++) {
        if (ins.length < len) {

        } else {
          createWidget(ins[i]);
        }
      }
    } else {
      //console.log('no ins');
    }
  }

  function getIns() {
    return getElementsByClassname(widgetClassName, 'ins');
  }

  function getIframePath(data) {
    var host = hosts[data.cn];
    var type = data.type || 'widget2';
    if (host) {
      return 'http://' + host + '/' + type + '/widget_frame';
    }
  }

  function createWidget(ins) {
    var data = {
      type: getAtrr(ins, 'data-type'),
      params: getAtrr(ins, 'data-params'),
      v: getAtrr(ins, 'data-v'),
      h: getAtrr(ins, 'data-h'),
      cn: getAtrr(ins, 'data-cn'),
      done: getAtrr(ins, 'data-done')
    };

    if (data.done) {
      return;
    } else {
      setAttr(ins, 'data-done', 'true');
    }

    var path = getIframePath(data);
    if (!path || !data.cn || !data.params) {
      console.log('invalid widget params', data);
      return;
    }
    data.params += ';source=ins';
    var host = window.location.hostname || 'unknown';
    data.params += ';refhost=' + host;
    var ps = '?' + data.params.replace(/;/g, '&amp;');
    ins.innerHTML = '<i' + 'fra' + 'me src="' + path + ps + '" scrolling="no" frameborder="0" allowTransparency="true" style="border:none;overflow:hidden;height:' + data.h + 'px;width:100%"></iframe>';
  }

  function getAtrr(ele, attr) {
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

  function setAttr(element, name, value) {
    try {
      element.setAttribute(name, value);
    } catch (e) {}
  }

  function getElementsByClassname(className, tagName, node) {
    "use strict";
    node = node ? node : document;
    tagName = tagName ? tagName : "*";

    if (document.getElementsByClassName) {
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

  function insertScript(url) {
    var head = document.getElementsByTagName('head')[0];
    var ins = document.createElement('script');
    ins.async = 1;
    ins.src = url;
    head.appendChild(ins);
  }

  try {
    createInitialWidgets();
    // insertScript('//s3.eu-central-1.amazonaws.com/wrm/ins.js');
  } catch (e) {}

})('ournetweather');
