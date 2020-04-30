/**
 * vuex v0.2.4
 * (c) 2020 Steven Lin
 * @license MIT
 */
'use strict';

function mapStore (store, ref) {
  var format = ref.format; if ( format === void 0 ) format = 'module';
  var module = ref.module;

  var mappedStore = walkObject(module || store._modules.root._rawModule.modules, new ModuleFactory(store));
  console.log(format);
  if (format === 'vuex') {
    return mapStoreToVuexFormat(mappedStore)
  }
  return mappedStore
}

var actionTypeMapping = {
  getters: 'getters',
  dispatch: 'actions',
  commit: 'mutations',
  state: 'state'
};

function mapStoreToVuexFormat (vuexStore) {
  var keys = Object.keys(vuexStore);
  return keys.reduce(function (store, key) {
    var module = vuexStore[key];
    function addActions (module, name, store, type) {
      var obj;

      var methodTypes = module[actionTypeMapping[type]] || {};
      if (store[type]) {
        store[type][name] = methodTypes;
      } else {
        store[type] = ( obj = {}, obj[name] = methodTypes, obj );
      }
    }
    addActions(module, key, store, 'getters');
    addActions(module, key, store, 'dispatch');
    addActions(module, key, store, 'commit');
    addActions(module, key, store, 'state');
    return store
  }, {})
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
  this.store = store;
};

ModuleFactory.prototype.create = function create (path, val) {
    var this$1 = this;

  var module = path[0];
    var type = path[1];
    var name = path[2];
  if (path.length === 1) {
    Object.defineProperty(val, 'state', {
      get: function () {
        return this$1.store.state[module]
      }
    });
    if (val.getters) {
      var gettersKey = Object.keys(val.getters);
      var getters = gettersKey.reduce(function (prev, key) {
        var getterName = module + "/" + key;
        Object.defineProperty(prev, key, {
          get: function () {
            return this.getters[getterName]
          }.bind(this$1.store)
        });
        return prev
      }, {});
      Object.defineProperty(val, 'getters', {
        get: function get () {
          return getters
        }
      });
    }
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
    }
  }
  return val
};

ModuleFactory.prototype.applyFun = function applyFun (func) {
    var this$1 = this;

  return function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return func.apply(this$1.store, args);
    }
};

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex-help] " + msg)) }
}

var Vue;
function applyMixin (_Vue, options) {
  if ( options === void 0 ) options = {};

  assert(Vue !== _Vue, 'already installed');

  Vue = _Vue;

  var descriptor = {
    get: function get () {
      return this.$root.$_h
    }
  };
  var name = options.name; if ( name === void 0 ) name = '$h';
  Object.defineProperty(Vue.prototype, name, descriptor);

  Vue.mixin(
    {
      beforeCreate: function beforeCreate () {
        if (this.$root === this) {
          this.$_h = mapStore(this.$store, options);
        }
      }
    });
}

var Vue$1; // bind on install
function install (_Vue, options) {
  if (Vue$1 && _Vue === Vue$1) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue$1 = _Vue;
  applyMixin(Vue$1, options);
}

var index = {
  install: install,
  mapStore: mapStore,
  version: '0.2.4'
};

module.exports = index;
