/**
 * vuex v0.1.6
 * (c) 2020 Steven Lin
 * @license MIT
 */
function mapStore (modules, store) {
  return walkObject(modules, new ModuleFactory(store))
}

function walkObject (obj, factory, path = []) {
  const val = Object.keys(obj).reduce((acc, key) => {
    const propVal = obj[key];
    path.push(key);
    if (isObject(propVal)) {
      return { ...acc, [key]: walkObject(propVal, factory, path) }
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
    this.context = store;
  }

  create (path, val) {
    const [module, type, name] = path;
    if (path.length === 2 && type === 'state') {
      return this.context.state[module]
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
            this.dispatch(eventName, ...arg);
          })
        case 'getters' :
          return this.context.getters[eventName]
      }
    }
    return val
  }

  applyFun (func) {
    return (...args) => func.apply(this.context, args)
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
        return mapStore(modules, this.$store)
      };
    }
  }
};

function applyMixin (Vue, options) {
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
  version: '0.1.6'
};

export default index_esm;
export { install };
