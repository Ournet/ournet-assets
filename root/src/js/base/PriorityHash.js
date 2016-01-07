/**
 * PriotiryHash class
 * --- dependencies: Array.indexOf
 */
(function() {
  'use strict';


  function PriorityHash(comparers, idname, capacity) {
    this.idname = idname || 'id';
    this.capacity = capacity || 0;

    if (!isString(this.idname)) throw new Error('invalid param "idname"');

    comparers = comparers || {};
    if (!isObject(comparers)) throw new Error('comparers param must be an object: {count: "d", time: "a"}');
    this.comparers = [];
    var af = function(a, b) {
      return a - b;
    }
    var df = function(a, b) {
      return b - a;
    }
    for (var prop in comparers) {
      if (comparers.hasOwnProperty(prop)) {
        var v = comparers[prop];
        if (v == 'a') this.comparers.push({
          name: prop,
          f: af
        });
        else if (v == 'd') this.comparers.push({
          name: prop,
          f: df
        });
      }
    }
    if (this.comparers.length == 0) throw new Error('no comparers!');

    this.__items = [];
  }

  PriorityHash.create = function(comparers, idname, capacity) {
    return new PriorityHash(comparers, idname, capacity);
  };

  function listComparer(a, b, comparers) {
    var r;
    for (var i = 0; i < comparers.length; i++) {
      var f = comparers[i];
      r = f(a, b);
      if (r !== 0) break;
    }
    return r;
  }

  function sort(items, comparers) {
    var comparer = function(a, b) {
      var r;
      for (var i = 0; i < comparers.length; i++) {
        var c = comparers[i];
        r = c.f(a[c.name], b[c.name]);
        if (r !== 0) break;
      }
      return r;
    }

    return items.sort(comparer);
  }

  PriorityHash.prototype.getList = function() {
    return this.__items;
  }

  PriorityHash.prototype.clear = function() {
    this.__items = [];
  }

  PriorityHash.prototype.remove = function(item) {
    var i = this.indexOf(item);
    if (i > -1) this.__items.splice(i, 1);
  }
  PriorityHash.prototype.removeId = function(id) {
    var i = this.indexOfId(id);
    if (i > -1) this.__items.splice(i, 1);
  }

  PriorityHash.prototype.set = function(items) {
    if (!isArray(items)) items = [items];
    for (var i = items.length - 1; i >= 0; i--) {
      this.setItem(items[i]);
    }
  }

  PriorityHash.prototype.getById = function(id) {
    var i = this.indexOfId(id);
    if (i < 0) return null;
    return this.__items[i];
  }


  PriorityHash.prototype.setItem = function(item) {
    var id = item[this.idname];

    if (!id) throw new Error('invalid item structure: ' + item);

    for (var i = this.comparers.length - 1; i >= 0; i--) {
      var n = this.comparers[i].name;
      if (!item[n]) throw new Error('invalid item structure: ' + item);
    }
    var i = this.indexOfId(id);

    if (i > -1) this.__items[i] = item;
    else this.__items.push(item);

    this.__items = sort(this.__items, this.comparers);
    if (this.capacity > 0 && this.__items.length > this.capacity) {
      this.__items = this.__items.slice(0, this.capacity);
    }
  }

  PriorityHash.prototype.indexOf = function(item) {
    return this.indexOfId(item[this.idname]);
  }

  PriorityHash.prototype.indexOfId = function(id) {
    for (var i = 0; i < this.__items.length; i++) {
      if (this.__items[i][this.idname] == id) return i;
    }
    return -1;
  }

  function isString(obj) {
    return typeof obj === 'string';
  }

  function isObject(obj) {
    return typeof obj === 'object';
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  if (typeof module !== 'undefined' && module.exports) {
    if (typeof define === 'function' && define.amd) {
      define('PriorityHash', function() {
        return PriorityHash;
      });
    } else {
      module.exports = PriorityHash;
    }
  } else {
    if (typeof define === 'function' && define.amd) {
      define('PriorityHash', function() {
        return PriorityHash;
      });
    } else {
      window.PriorityHash = PriorityHash;
    }
  }
})();