(function(name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
})('$', this, function() {
  var q = qwery;
  q.ready = domready;

  q.__addBean = function() {
    for (var prop in bean) {
      if (bean.hasOwnProperty(prop) && prop!='setSelectorEngine') {
        q[prop] = obj[prop];
      }
    }

    bean.setSelectorEngine(qwery);
  }

  return q;
})