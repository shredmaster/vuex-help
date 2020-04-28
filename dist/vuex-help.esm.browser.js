/**
 * vuex v0.2.3
 * (c) 2020 Steven Lin
 * @license MIT
 */
function mapStore (store, modules) {
  modules = modules || store._modules.root._rawModule.modules;
  return walkObject(modules, new ModuleFactory(store))
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

const vuexHelpMixin = function ({ modules }) {
  return {
    beforeCreate () {
      const options = this.$options;
      if (!options.computed) options.computed = {};
      if (options.computed.$h) return
      options.computed.$h = function () {
        return mapStore(this.$store)
      };
    }
  }
};

function applyMixin (Vue, options = {}) {
  const version = Number(Vue.version.split('.')[0]);
  if (version > 2) {
    throw Error('version not supported')
  }
  Vue.mixin(vuexHelpMixin(options));
}

let Vue; // bind on install
function install (_Vue, options) {
  if (Vue && _Vue === Vue) {
    {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue, options);
}

var index_esm = {
  install,
  mapStore,
  version: '0.2.3'
};

export default index_esm;
export { install, mapStore };
