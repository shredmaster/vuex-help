/**
 * vuex v0.0.1
 * (c) 2020 Evan You
 * @license MIT
 */
'use strict';

var vuexHelpMixin = function (modules) {
  return {
    beforeCreate: function beforeCreate () {
      var options = this.$options;
      if (!options.computed) { options.computed = {}; }
      if (options.computed.$h) { return }
      options.computed.$h = function () {
        return { crap: 'ok' }
      };
    }
  }
};

function applyMixin (Vue, options) {
  var version = Number(Vue.version.split('.')[0]);
  if (version > 2) {
    throw Error('version not supported')
  }
  Vue.mixin(vuexHelpMixin());
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
  applyMixin(Vue);
}

var index = {
  install: install,
  version: '0.0.1'
};

module.exports = index;
