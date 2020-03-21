/**
 * vuex v0.0.1
 * (c) 2020 Evan You
 * @license MIT
 */
'use strict';

var this$1 = undefined;
function recursiveDecorator (obj, adapter) {
  return Object.keys(obj).reduce(function (acc, key) {
    var obj$1, obj$2, obj$3;

    adapter.push(key);
    var objProp = obj[key];
    switch (typeof objProp) {
      case 'object':
        return Object.assign({}, acc, ( obj$1 = {}, obj$1[key] = recursiveDecorator(objProp, adapter), obj$1 ))

      case 'function':
        return Object.assign({}, acc, ( obj$2 = {}, obj$2[key] = adapter.adapt(objProp), obj$2 ))
    }
    adapter.pop();
    return Object.assign({}, acc, ( obj$3 = {}, obj$3[key] = objProp, obj$3 ))
  }, {})
}

var Adapter = function (component) {
  return {
    keys: [],
    push: function (key) {
      console.log(this$1.key, this$1.keys);
      this$1.keys.push(key);
      console.log(this$1.keys);
    },
    pop: function () {
      this$1.keys.pop();
    },
    adapt: function (fn) {
      console.log(this$1.keys);
      console.log(fn);
      return fn
    }
  }
};

var vuexHelpMixin = function (modules) {
  return {
    beforeCreate: function beforeCreate () {
      var options = this.$options;
      if (!options.computed) { options.computed = {}; }
      if (options.computed.$h) { return }
      var adapter = Adapter(this);
      options.computed.$h = function () {
        return recursiveDecorator(modules, adapter)
      };
    }
  }
};

function applyMixin (Vue, options) {
  var version = Number(Vue.version.split('.')[0]);
  if (version > 2) {
    throw Error('version not supported')
  }
  Vue.mixin(vuexHelpMixin(options));
}

var Vue; // bind on install
function install (_Vue, options) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue, options);
}

var index = {
  install: install,
  version: '0.0.1'
};

module.exports = index;
