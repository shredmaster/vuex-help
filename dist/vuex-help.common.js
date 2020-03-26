/**
 * vuex v0.1.3
 * (c) 2020 Steven Lin
 * @license MIT
 */
'use strict';

function mapStore (modules, store) {
  return walkObject(modules, new ModuleFactory(store))
}

function walkObject (obj, factory, path) {
  if ( path === void 0 ) path = [];

  var val = Object.keys(obj).reduce(function (acc, key) {
    var obj$1, obj$2;

    var propVal = obj[key];
    path.push(key);
    if (isObject(propVal)) {
      return Object.assign({}, acc, ( obj$1 = {}, obj$1[key] = walkObject(propVal, factory, path), obj$1 ))
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
  var module = path[0];
    var type = path[1];
    var name = path[2];
  if (type === 'state') {
    if (isFunction(val)) {
      return val()
    }
    return val
  }
  var eventName = module + "/" + name;
  if (module && name) {
    assert(isFunction(val), 'value must be an function');
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
          (ref = this).dispatch.apply(ref, [ eventName ].concat( arg ));
        })
      case 'getters' :
        return this.applyFun(function () {
            var ref;

            var arg = [], len = arguments.length;
            while ( len-- ) arg[ len ] = arguments[ len ];
          (ref = this.getters)[eventName].apply(ref, arg);
        })
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

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex-help] " + msg)) }
}

var vuexHelpMixin = function (ref) {
  var modules = ref.modules;

  return {
    beforeCreate: function beforeCreate () {
      var options = this.$options;
      if (!options.computed) { options.computed = {}; }
      if (options.computed.$h) { return }
      options.computed.$h = function () {
        return mapStore(modules, this.$store)
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
  version: '0.1.3'
};

module.exports = index;
