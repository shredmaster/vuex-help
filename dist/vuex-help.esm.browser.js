/**
 * vuex v0.2.4
 * (c) 2020 Steven Lin
 * @license MIT
 */
function mapStore (store, { format = 'module', module }) {
  const mappedStore = walkObject(module || store._modules.root._rawModule.modules, new ModuleFactory(store));
  console.log(format);
  if (format === 'vuex') {
    return mapStoreToVuexFormat(mappedStore)
  }
  return mappedStore
}

const actionTypeMapping = {
  getters: 'getters',
  dispatch: 'actions',
  commit: 'mutations',
  state: 'state'
};

function mapStoreToVuexFormat (vuexStore) {
  const keys = Object.keys(vuexStore);
  return keys.reduce((store, key) => {
    const module = vuexStore[key];
    function addActions (module, name, store, type) {
      const methodTypes = module[actionTypeMapping[type]] || {};
      if (store[type]) {
        store[type][name] = methodTypes;
      } else {
        store[type] = { [name]: methodTypes };
      }
    }
    addActions(module, key, store, 'getters');
    addActions(module, key, store, 'dispatch');
    addActions(module, key, store, 'commit');
    addActions(module, key, store, 'state');
    return store
  }, {})
}

function walkObject (obj, factory, path = [], nodes = {}) {
  const val = Object.keys(obj).reduce((acc, key) => {
    const propVal = obj[key];
    path.push(key);
    if (isObject(propVal) && nodes[propVal] !== propVal) {
      nodes[propVal] = propVal;
      return { ...acc, [key]: walkObject(propVal, factory, path, nodes) }
    }
    const value = factory.create(path, propVal);
    path.pop();
    return { ...acc, [key]: value }
  }, {});
  const result = factory.create(path, val);
  path.pop();
  return result
}

class ModuleFactory {
  constructor (store) {
    this.store = store;
  }

  create (path, val) {
    const [module, type, name] = path;
    if (path.length === 1) {
      Object.defineProperty(val, 'state', {
        get: () => {
          return this.store.state[module]
        }
      });
      if (val.getters) {
        const gettersKey = Object.keys(val.getters);
        const getters = gettersKey.reduce((prev, key) => {
          const getterName = `${module}/${key}`;
          Object.defineProperty(prev, key, {
            get: function () {
              return this.getters[getterName]
            }.bind(this.store)
          });
          return prev
        }, {});
        Object.defineProperty(val, 'getters', {
          get () {
            return getters
          }
        });
      }
      return val
    }
    const eventName = `${module}/${name}`;
    if (module && name && path.length === 3) {
      switch (type) {
        case 'mutations':
          return this.applyFun(function (...arg) {
            this.commit(eventName, ...arg);
          })
        case 'actions' :
          return this.applyFun(function (...arg) {
            return this.dispatch(eventName, ...arg)
          })
      }
    }
    return val
  }

  applyFun (func) {
    return (...args) => func.apply(this.store, args)
  }
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function assert (condition, msg) {
  if (!condition) throw new Error(`[vuex-help] ${msg}`)
}

let Vue;
function applyMixin (_Vue, options = {}) {
  assert(Vue !== _Vue, 'already installed');

  Vue = _Vue;

  const descriptor = {
    get () {
      return this.$root.$_h
    }
  };
  const { name = '$h' } = options;
  Object.defineProperty(Vue.prototype, name, descriptor);

  Vue.mixin(
    {
      beforeCreate () {
        if (this.$root === this) {
          this.$_h = mapStore(this.$store, options);
        }
      }
    });
}

let Vue$1; // bind on install
function install (_Vue, options) {
  if (Vue$1 && _Vue === Vue$1) {
    {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue$1 = _Vue;
  applyMixin(Vue$1, options);
}

var index_esm = {
  install,
  mapStore,
  version: '0.2.4'
};

export default index_esm;
export { install, mapStore };
