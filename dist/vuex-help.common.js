/**
 * vuex v0.2.1
 * (c) 2020 Steven Lin
 * @license MIT
 */
'use strict';

function mapStore (store, modules) {
  modules = modules || store._modules.root._rawModule.modules;
  return walkObject(modules, new ModuleFactory(store))
}

function walkObject (obj, factory, path, nodes) {
  if ( path === void 0 ) path = [];
  if ( nodes === void 0 ) nodes = {};

  var val = Object.keys(obj).reduce(function (acc, key) {
    var obj$1, obj$2;

    var propVal = obj[key];
    path.push(key);
    if (isObject(propVal) && nodes[propVal] !== propVal) {
      nodes[propVal] = propVal;
      return Object.assign({}, acc, ( obj$1 = {}, obj$1[key] = walkObject(propVal, factory, path, nodes), obj$1 ))
    }
    var value = factory.create(path, propVal);
    path.pop();
    return Object.assign({}, acc, ( obj$2 = {}, obj$2[key] = value, obj$2 ))
  }, {});
  var result = factory.create(path, val);
  path.pop();
  return result
}

var ModuleFactory = function ModuleFactory (store) {
  this.context = store;
};

ModuleFactory.prototype.create = function create (path, val) {
    var this$1 = this;

  var module = path[0];
    var type = path[1];
    var name = path[2];
  if (path.length === 1) {
    Object.defineProperty(val, 'state', {
      get: function () { return this$1.context.state[module] }
    });
    return val
  }
  var eventName = module + "/" + name;
  if (module && name && path.length === 3) {
    switch (type) {
      case 'mutations':
        return this.applyFun(function () {
            var ref;

            var arg = [], len = arguments.length;
            while ( len-- ) arg[ len ] = arguments[ len ];
          (ref = this).commit.apply(ref, [ eventName ].concat( arg ));
        })
      case 'actions' :
        return this.applyFun(function () {
            var ref;

            var arg = [], len = arguments.length;
            while ( len-- ) arg[ len ] = arguments[ len ];
          return (ref = this).dispatch.apply(ref, [ eventName ].concat( arg ))
        })
      case 'getters' :
        return this.context.getters[eventName]
    }
  }
  return val
};

ModuleFactory.prototype.applyFun = function applyFun (func) {
    var this$1 = this;

  return function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return func.apply(this$1.context, args);
    }
};

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var vuexHelpMixin = function (ref) {
  var modules = ref.modules;

  return {
    beforeCreate: function beforeCreate () {
      var options = this.$options;
      if (!options.computed) { options.computed = {}; }
      if (options.computed.$h) { return }
      options.computed.$h = function () {
        return mapStore(this.$store, modules)
      };
    }
  }
};

function applyMixin (Vue, options) {
  if ( options === void 0 ) options = {};

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
  mapStore: mapStore,
  version: '0.2.1'
};

module.exports = index;
